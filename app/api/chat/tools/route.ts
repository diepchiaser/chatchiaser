import { openapiToFunctions } from "@/lib/openapi-conversion"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Tables } from "@/supabase/types"
import {
  ChatSettings,
  DEFAULT_AIRFORCE_IMAGE_GENERATOR_NAME,
  DEFAULT_POLLINATIONS_IMAGE_GENERATOR_NAME
} from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"
import { getToolById } from "@/db/tools"
import { DEFAULT_AIRFORCE_AUDIO_GENERATOR_NAME } from "@/types/airforce-audio"
import { DEFAULT_YOUDAO_AUDIO_GENERATOR_NAME } from "@/types/youdao-audio"

export async function POST(request: Request) {
  try {
    const { chatSettings, messages, selectedTools } = await request.json()

    const profile = await getServerProfile()

    // Kiểm tra các công cụ hình ảnh và âm thanh
    for (const toolType of [
      {
        name: DEFAULT_POLLINATIONS_IMAGE_GENERATOR_NAME,
        processor: processImageTool
      },
      {
        name: DEFAULT_AIRFORCE_IMAGE_GENERATOR_NAME,
        processor: processImageTool
      },
      {
        name: DEFAULT_AIRFORCE_AUDIO_GENERATOR_NAME,
        processor: processAudioTool
      },
      { name: DEFAULT_YOUDAO_AUDIO_GENERATOR_NAME, processor: processAudioTool }
    ]) {
      const tool = selectedTools.find(t => t.name === toolType.name)
      if (tool) {
        try {
          const fullUrl = toolType.processor(tool, messages)
          return new Response(fullUrl, {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          })
        } catch (error) {
          console.error(`Error processing ${toolType.name}:`, error)
          return new Response(`Error processing ${toolType.name}`, {
            status: 400
          })
        }
      }
    }

    // Xử lý OpenAI
    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    const { allTools, schemaDetails } = await processOpenAITools(
      selectedTools,
      openai,
      messages,
      chatSettings
    )

    // Xử lý OpenAI completion
    const firstResponse = await openai.chat.completions.create({
      model: chatSettings.model,
      messages,
      tools: allTools.length > 0 ? allTools : undefined
    })

    const message = firstResponse.choices[0].message
    messages.push(message)

    const toolCalls = message.tool_calls || []

    if (toolCalls.length === 0) {
      return new Response(message.content, {
        headers: { "Content-Type": "application/json" }
      })
    }

    // Xử lý tool calls
    const toolResults = await processToolCalls(
      toolCalls,
      messages,
      schemaDetails
    )
    messages.push(...toolResults)

    // Xử lý second response
    const secondResponse = await openai.chat.completions.create({
      model: chatSettings.model,
      messages,
      stream: true
    })

    const stream = OpenAIStream(secondResponse)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
    const errorMessage = error.error?.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}

// Tách hàm xử lý công cụ hình ảnh
function processImageTool(tool, messages) {
  const { url, schema } = tool

  if (typeof schema !== "string") {
    throw new Error("Invalid schema format")
  }

  const parsedSchema = JSON.parse(schema)
  const { default_parameters: defaultParameters } = parsedSchema || {}

  if (!defaultParameters) {
    throw new Error("Default parameters are missing")
  }

  const { seed, width, height, size, model } = defaultParameters
  const lastMessage = messages[messages.length - 1]
  const encodedContent = encodeURIComponent(lastMessage.content)

  let fullUrl

  if (tool.name === DEFAULT_AIRFORCE_IMAGE_GENERATOR_NAME) {
    fullUrl = `${url}?prompt=${encodedContent}&${new URLSearchParams({
      seed,
      model,
      ...(size && { size })
    }).toString()}`
  } else if (tool.name === DEFAULT_POLLINATIONS_IMAGE_GENERATOR_NAME) {
    fullUrl = `${url}${encodedContent}?${new URLSearchParams({
      seed,
      model,
      ...(width && { width }),
      ...(height && { height })
    }).toString()}`
  }

  return fullUrl
}

// Tách hàm xử lý công cụ âm thanh
function processAudioTool(tool, messages) {
  const { url, schema } = tool
  const parsedSchema = JSON.parse(schema as string)

  if (!parsedSchema) {
    throw new Error("Invalid schema format")
  }

  const { default_parameters: defaultParameters } = parsedSchema || {}

  if (!defaultParameters) {
    throw new Error("Default parameters are missing")
  }

  const lastMessage = messages[messages.length - 1]
  const encodedContent = encodeURIComponent(lastMessage.content)

  if (tool.name === DEFAULT_AIRFORCE_AUDIO_GENERATOR_NAME) {
    const { voice } = defaultParameters
    return `${url}?text=${encodedContent}&voice=${voice}`
  } else if (tool.name === DEFAULT_YOUDAO_AUDIO_GENERATOR_NAME) {
    const { type, le } = defaultParameters
    return `${url}?audio=${encodedContent}&type=${type}&le=${le}`
  }

  throw new Error("Unknown audio tool")
}

// Xử lý các tool calls
async function processToolCalls(toolCalls, messages, schemaDetails) {
  const toolResults = await Promise.all(
    toolCalls.map(async toolCall => {
      const functionCall = toolCall.function
      const functionName = functionCall.name
      const argumentsString = toolCall.function.arguments.trim()
      const parsedArgs = JSON.parse(argumentsString)

      // Tìm schema phù hợp
      const schemaDetail = schemaDetails.find(detail =>
        Object.values(detail.routeMap).includes(functionName)
      )

      if (!schemaDetail) {
        throw new Error(`Function ${functionName} not found in any schema`)
      }

      const pathTemplate = Object.keys(schemaDetail.routeMap).find(
        key => schemaDetail.routeMap[key] === functionName
      )

      if (!pathTemplate) {
        throw new Error(`Path for function ${functionName} not found`)
      }

      const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
        const value = parsedArgs.parameters[paramName]
        if (!value) {
          throw new Error(
            `Parameter ${paramName} not found for function ${functionName}`
          )
        }
        return encodeURIComponent(value)
      })

      // Xử lý fetch request
      let data = await fetchToolData(schemaDetail, path, parsedArgs)

      return {
        tool_call_id: toolCall.id,
        role: "tool",
        name: functionName,
        content: JSON.stringify(data)
      }
    })
  )

  return toolResults
}

// Tách hàm xử lý fetch
async function fetchToolData(schemaDetail, path, parsedArgs) {
  // Xử lý request in body hoặc query
  if (schemaDetail.requestInBody) {
    // Xử lý headers
    let headers = { "Content-Type": "application/json" }

    if (schemaDetail.headers && typeof schemaDetail.headers === "string") {
      try {
        headers = { ...headers, ...JSON.parse(schemaDetail.headers) }
      } catch (error) {
        console.error("Error parsing headers:", error)
      }
    }

    const fullUrl = schemaDetail.url + path
    const bodyContent = parsedArgs.requestBody || parsedArgs

    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyContent)
    })

    if (!response.ok) {
      return { error: response.statusText }
    }

    return await response.json()
  } else {
    // Xử lý query
    const queryParams = new URLSearchParams(parsedArgs.parameters).toString()
    const fullUrl =
      schemaDetail.url + path + (queryParams ? "?" + queryParams : "")

    let headers = {}

    if (schemaDetail.headers && typeof schemaDetail.headers === "string") {
      try {
        headers = JSON.parse(schemaDetail.headers)
      } catch (error) {
        console.error("Error parsing headers:", error)
      }
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      headers
    })

    if (!response.ok) {
      return { error: response.statusText }
    }

    return await response.json()
  }
}

// Xử lý công cụ OpenAI và schemas
async function processOpenAITools(
  selectedTools,
  openai,
  messages,
  chatSettings
) {
  let allTools = []
  let allRouteMaps = {}
  let schemaDetails = []

  await Promise.all(
    selectedTools.map(async selectedTool => {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        )
        allTools = allTools.concat(convertedSchema.functions || [])

        const routeMap = convertedSchema.routes.reduce((map, route) => {
          map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId
          return map
        }, {})

        allRouteMaps = { ...allRouteMaps, ...routeMap }

        schemaDetails.push({
          title: convertedSchema.info.title,
          description: convertedSchema.info.description,
          url: convertedSchema.info.server,
          headers: selectedTool.custom_headers,
          routeMap,
          requestInBody: convertedSchema.routes[0].requestInBody
        })
      } catch (error) {
        console.error("Error converting schema", error)
      }
    })
  )

  return { allTools, allRouteMaps, schemaDetails }
}
