import { ChatSettings } from "@/types"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://api.zanity.xyz"
    const apikey = process.env.NEXT_PUBLIC_ZANITY_API_KEY

    if (!apikey) {
      return new Response(JSON.stringify({ message: "API key not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    const body = {
      messages: messages,
      model: chatSettings.model
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
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      })
    }

    const data = await response.json()

    return new Response(data.choices[0].message.content, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
