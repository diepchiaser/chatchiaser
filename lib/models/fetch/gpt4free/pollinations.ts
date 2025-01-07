import { LLMID, ModelProvider } from "@/types"

interface Model {
  name: string
  type?: string
  censored?: boolean
  description?: string
  baseModel?: boolean
}

export const fetchPollinationsModels = async () => {
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

    // Parse JSON manually
    const data = JSON.parse(text)

    return data.map((model: Model) => ({
      modelId: model.name as LLMID,
      modelName: model.description,
      provider: "pollination" as ModelProvider,
      hostedId: model.description?.toLowerCase().replace(/\s+/g, "-"),
      platformLink: "https://pollinations.ai",
      imageInput: false
    }))
  } catch (error) {
    console.warn("Error fetching hosted models: " + error)
  }
}
