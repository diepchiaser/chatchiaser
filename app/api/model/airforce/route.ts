import { Model } from "./type"

export async function GET(request: Request) {
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

    const models = data.map((model: Model) => ({
      modelId: model.id,
      modelName: model.id
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase()),
      provider: "airforce",
      hostedId: model.id,
      platformLink: "https://airforce.com",
      imageInput: false
    }))
    console.log("Model", models)

    return new Response(JSON.stringify(models), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    console.error("Error subscribing user:", error)

    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
