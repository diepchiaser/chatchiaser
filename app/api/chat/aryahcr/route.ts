import { ChatSettings } from "@/types"

interface ResponseStatus {
  status: "pending" | "error" | "completed" | "not_found"
}

interface ApiResponse {
  data: {
    id: string
  }
  status: ResponseStatus["status"]
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
      stream: false,
      markdown: false,
      model: chatSettings.model
    }

    console.log("body", body)

    const response = await fetch(url + "complements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ message: response.statusText }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      })
    }

    const result = (await response.json()) as ApiResponse

    let id = result.id
    let taskResponse: ApiResponse | null = null
    let isProcessing = true

    while (isProcessing) {
      const taskResult = await fetch(url + "task/" + encodeURIComponent(id))
      taskResponse = (await taskResult.json()) as ApiResponse

      switch (taskResponse.status) {
        case "pending":
          isProcessing = true
          // Add a small delay to prevent overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000))
          break
        case "error":
        case "completed":
        case "not_found":
          isProcessing = false
          break
      }
    }

    console.log("taskResponse", taskResponse)

    // Return the final response
    return new Response(taskResponse.message, {
      status: 200,
      headers: { "Content-Type": "application/text" }
    })
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode,
      headers: { "Content-Type": "application/json" }
    })
  }
}
