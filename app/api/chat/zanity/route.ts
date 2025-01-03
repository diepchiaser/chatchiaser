import { ChatSettings } from "@/types"
import { createStreamResponseV2 } from "@/utils"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const profile = await getServerProfile()
    checkApiKey(profile.zanity_api_key, "Zanity")

    const url = "https://api.zanity.xyz"
    const apikey = profile.zanity_api_key

    console.log("API Key: " + apikey)

    const body = {
      messages: messages,
      model: chatSettings.model,
      stream: true
    }

    const response = await fetch(url + "/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: response.statusText + ". Please check API key!"
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const reader = response.body?.getReader()
    return createStreamResponseV2(reader, { type: "openai" })
  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message + ". Please check API key!" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
