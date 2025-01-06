import { ChatSettings } from "@/types"

interface ChatResponse {
  id: string
  status: string
}

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const url = "https://nexra.aryahcr.cc/api/chat/"
    const body = {
      messages: messages,
      stream: true,
      markdown: false,
      model: "gpt-4"
    }
    const response = await fetch(url + "gpt", {
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

    console.log("Response: ", response)

    const initialData = await response.json()
    const taskId = initialData.id

    // Polling logic
    let polling = true
    let pollResponse: ChatResponse | null = null

    while (polling) {
      const statusResponse = await fetch(
        url + "task/" + encodeURIComponent(taskId),
        {
          method: "GET"
        }
      )

      if (!statusResponse.ok) {
        return new Response(
          JSON.stringify({ message: statusResponse.statusText }),
          {
            status: statusResponse.status
          }
        )
      }

      pollResponse = await statusResponse.json()
      console.log(pollResponse)

      switch (pollResponse.status) {
        case "pending":
          polling = true
          // Optional: Add delay between polls
          // await new Promise(resolve => setTimeout(resolve, 1000))
          break
        case "error":
        case "completed":
        case "not_found":
          polling = false
          break
      }
    }

    return new Response(JSON.stringify(pollResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500
    })
  }
}
