import { ChatSettings } from "@/types"
import { eventStream, UtilsInstance } from "@/utils"
import { v4 } from "uuid"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 5000)

    const now = new Date()
    const url = "https://api.caipacity.com"
    const body = {
      model: "gpt-3.5-turbo",
      temperature: chatSettings.temperature,
      messages: messages,
      stream: false,
      d: now.toISOString().split("T")[0],
      t: now.getTime(),
      s: UtilsInstance.hash({ t: now.getTime(), m: JSON.stringify(messages) })
    }

    const response = await fetch(url + "/v1/chat/completions", {
      method: "POST",
      headers: {
        authority: "api.caipacity.com",
        accept: "*/*",
        "accept-language":
          "en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3",
        authorization: "Bearer free",
        "client-id": v4(),
        "client-v": "0.1.249",
        "content-type": "application/json",
        origin: "https://ai.ls",
        referer: "https://ai.ls/",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      },
      body: JSON.stringify(body),
      signal: controller.signal
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      })
    }

    const result = await response.text()

    return new Response("Please visit: https://ai.ls", {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
