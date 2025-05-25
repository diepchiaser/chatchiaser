import { Model } from "./type"
import { LLMID, ModelProvider } from "@/types"

export async function GET() {
  try {
    const response = await fetch("https://text.pollinations.ai/models")

    if (!response.ok) {
      throw new Error(`Pollinations server is not responding.`)
    }

    const text = await response.text()
    const data = JSON.parse(text)

    const models = data.map((model: Model) => {
      // Map model capabilities based on model ID
      const isVisionCapable = [
        "openai",
        "openai-large",
        "claude-hybridspace"
      ].includes(model.name)
      const isAudioCapable = model.name === "openai-audio"

      return {
        modelId: model.name as LLMID,
        modelName: model.description || model.name,
        provider: "pollination" as ModelProvider,
        hostedId: model.name,
        platformLink: "https://pollinations.ai",
        imageInput: isVisionCapable,
        audioInput: isAudioCapable,
        features: {
          vision: isVisionCapable,
          audio: isAudioCapable,
          streaming: true, // All models support streaming
          json: true // All models support JSON output format
        }
      }
    })

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
