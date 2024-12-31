import { LLM } from "@/types"

export const CHATGPT4: LLM = {
  modelId: "gpt-4",
  modelName: "GPT-4",
  provider: "aryahcr",
  hostedId: "openai-gpt-4",
  platformLink: "",
  imageInput: false
}

export const ARYAHR_LLM_LIST: LLM[] = [CHATGPT4]
