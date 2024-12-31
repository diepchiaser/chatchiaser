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
      seed: 42,
      jsonMode: true,
      mode: chatSettings.model
    }

    console.log("body: ", body)

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

    const responseText = await response.text()

    return new Response(responseText, {
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error: any) {
    console.log("error: ", error)
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
