import { ChatSettings } from "@/types"
import { createStreamResponseV2 } from "@/utils"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://api.airforce"
    const body = {
      model: chatSettings.model,
      messages: messages,
      stream: true,
      "max-tokens": 2048,
      temperature: chatSettings.temperature
    }

    const response = await fetch(url + "/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      })
    }

    const reader = response.body?.getReader()
    return createStreamResponseV2(reader, { type: "openai" })
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
