import { Model } from "./type"
import { LLMID, ModelProvider } from "@/types"

export async function GET() {
  try {
    const response = await fetch("https://text.pollinations.ai/models", {
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error(`Pollinations server is not responding.`)
    }

    const text = await response.text()

    // // Parse JSON manually
    const data = JSON.parse(text)

    const models = data.map((model: Model) => ({
      modelId: model.name as LLMID,
      modelName: model.description,
      provider: "pollination" as ModelProvider,
      hostedId: model.description?.toLowerCase().replace(/\s+/g, "-"),
      platformLink: "https://pollinations.ai",
      imageInput: false
    }))

    return new Response(JSON.stringify(models), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    console.warn("Error fetching hosted models: " + error)

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
