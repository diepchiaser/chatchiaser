import { ChatSettings } from "@/types"
import { createStreamResponse } from "@/utils"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://text.pollinations.ai/"
    const headers = {
      "Content-Type": "application/json"
    }
    const body = {
      messages: messages,
      seed: 42,
      jsonMode: true,
      mode: chatSettings.model,
      stream: true
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      })
    }

    const reader = response.body?.getReader()
    if (!reader) {
      return new Response(JSON.stringify({ message: "No response body" }), {
        status: 500
      })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              controller.close()
              break
            }

            const text = decoder.decode(value)

            const words = text.split(/\s+/)

            for (const word of words) {
              if (word) {
                const chunk = word + " "
                controller.enqueue(encoder.encode(chunk))
                await new Promise(resolve => setTimeout(resolve, 50))
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      }
    })

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    console.log("error: ", error)
    const errorMessage = error.message || "An unexpected error occurred"

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
