import { ChatSettings } from "@/types"

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
    if (!reader) {
      return new Response(JSON.stringify({ message: "No response body" }), {
        status: 500
      })
    }

    let previousMessage = ""
    const encoder = new TextEncoder()

    const readableStream = new ReadableStream({
      async start(controller) {
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const text = new TextDecoder().decode(value)

            buffer += text

            const chunks = buffer.split("\u001e")

            buffer = chunks.pop() || ""

            for (const chunk of chunks) {
              if (!chunk.trim()) continue

              try {
                const parsed = JSON.parse(chunk)

                if (parsed.error) {
                  throw new Error(parsed.error)
                }

                if (parsed.message && parsed.message !== previousMessage) {
                  const newContent = parsed.message.slice(
                    previousMessage.length
                  )
                  controller.enqueue(encoder.encode(newContent))
                  previousMessage = parsed.message
                }

                if (parsed.finish) {
                  controller.close()
                  return
                }
              } catch (e) {
                console.error("Parse error:", e)
                console.error("Problem chunk:", chunk)
                continue
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      }
    })

    console.log("Returning response:", readableStream)
    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
