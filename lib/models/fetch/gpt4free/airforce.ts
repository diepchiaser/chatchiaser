import { LLMID, ModelProvider } from "@/types"

interface Model {
  created?: number
  id: string
  object?: string
  owned_by?: string
}

export const fetchAirForceModels = async () => {
  try {
    const response = await fetch("https://api.airforce/v1/models", {
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      throw new Error(`Airforce server is not responding.`)
    }

    const { data } = await response.json()

    return data.map((model: Model) => ({
      modelId: model.id as LLMID,
      modelName: model.id
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()),
      provider: "airforce" as ModelProvider,
      hostedId: model.id,
      platformLink: "https://airforce.com",
      imageInput: false
    }))
  } catch (error) {
    console.warn("Error fetching hosted models: " + error)
  }
}
