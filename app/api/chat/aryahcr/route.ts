import { ChatSettings } from "@/types"
import { createStreamResponseV1 } from "@/utils"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://nexra.aryahcr.cc/api/chat/complements"
    const body = {
      messages: messages,
      stream: true,
      markdown: false,
      model: chatSettings.model
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status
      })
    }

    const reader = response.body?.getReader()
    return createStreamResponseV1(reader, { delimiter: "\u001e" })
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
