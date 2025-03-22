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
      reasoning: chatSettings.reasoning || true,
      frequency_penalty: chatSettings.reasoning ? 0.1 : 0,
      presence_penalty: chatSettings.reasoning ? 0.1 : 0,
      temperature: chatSettings.reasoning ? 0.7 : 0.5,
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

    let buffer = ""

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) {
              if (buffer.length > 0) {
                controller.enqueue(encoder.encode(buffer))
              }
              controller.close()
              break
            }

            const text = decoder.decode(value, { stream: true })
            // Process the text to extract only content
            const lines = text.split("\n")
            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const parsed = JSON.parse(line.slice(6))
                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content
                    controller.enqueue(encoder.encode(content))
                    await new Promise(resolve => setTimeout(resolve, 20))
                  }
                } catch (e) {
                  // Skip invalid JSON
                  continue
                }
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
