import { LLM } from "@/types"

export const CHATGPT4o: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "aryahcr",
  hostedId: "openai-gpt-4o",
  platformLink: "",
  imageInput: false
}

export const BING: LLM = {
  modelId: "Bing",
  modelName: "Bing",
  provider: "aryahcr",
  hostedId: "bing",
  platformLink: "",
  imageInput: false
}

export const BLACKBOX: LLM = {
  modelId: "blackbox",
  modelName: "Blackbox",
  provider: "aryahcr",
  hostedId: "",
  platformLink: "",
  imageInput: false
}

export const ARYAHR_LLM_LIST: LLM[] = [CHATGPT4o, BING, BLACKBOX]
