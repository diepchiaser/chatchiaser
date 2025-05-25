import { ChatSettings } from "@/types"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://text.pollinations.ai/openai" // Updated to use OpenAI compatible endpoint
    const headers = {
      "Content-Type": "application/json"
    }

    const body = {
      model: chatSettings.model, // Model identifier (openai, mistral, etc.)
      messages: messages, // Array of message objects
      temperature: chatSettings.temperature ?? 0.7,
      top_p: chatSettings.top_p ?? 1,
      stream: true,
      private: false, // Optional: prevent response from appearing in public feed
      reasoning_effort: chatSettings.reasoning ? "high" : "low" // Optional: for o3-mini model
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
            buffer += text
            // Process the buffer to extract complete messages
            const lines = buffer.split("\n")
            buffer = lines.pop() || "" // Keep any incomplete line in the buffer

            for (const line of lines) {
              const trimmedLine = line.trim()
              if (trimmedLine.startsWith("data: ")) {
                const data = trimmedLine.slice(5).trim()
                if (data === "[DONE]") continue

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.choices?.[0]?.delta?.content) {
                    const content = parsed.choices[0].delta.content
                    controller.enqueue(encoder.encode(content))
                  }
                } catch (e) {
                  console.warn("Failed to parse JSON:", e)
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
