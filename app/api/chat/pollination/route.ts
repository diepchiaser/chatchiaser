import { ChatSettings } from "@/types"

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
      mode: chatSettings.model,
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.5,
      top_p: 1,
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

    // Buffer to store incomplete UTF-8 sequences
    let buffer = ""

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              // Flush any remaining buffered content
              if (buffer.length > 0) {
                controller.enqueue(encoder.encode(buffer + " "))
              }
              controller.close()
              break
            }

            const text = decoder.decode(value, { stream: true })
            buffer += text

            // Split on sentence boundaries or punctuation
            const chunks = buffer.match(/[^.!?]+[.!?]+|\s+|[^\s]+/g) || []

            // Keep the last chunk in the buffer if it doesn't end with punctuation
            const lastChunk = chunks[chunks.length - 1]
            const complete = lastChunk?.match(/[.!?]$/)

            if (chunks.length > 1) {
              // Process all chunks except the last one if incomplete
              const processUntil = complete ? chunks.length : chunks.length - 1

              for (let i = 0; i < processUntil; i++) {
                controller.enqueue(encoder.encode(chunks[i]))
                await new Promise(resolve => setTimeout(resolve, 20)) // Reduced delay
              }

              buffer = complete ? "" : lastChunk
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      }
    })
  } catch (error: any) {
    console.error("error: ", error)
    const errorMessage = error.message || "An unexpected error occurred"

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
