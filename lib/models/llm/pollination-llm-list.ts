import { LLM } from "@/types"

export const OPENAI: LLM = {
  modelId: "openai",
  modelName: "GPT-4o",
  provider: "pollination",
  hostedId: "openai-gpt-4o",
  platformLink: "",
  imageInput: false
}

export const MISTRAL: LLM = {
  modelId: "mistral",
  modelName: "Mistral Nemo",
  provider: "pollination",
  hostedId: "mistral-nemo",
  platformLink: "",
  imageInput: false
}

export const MISTRAL_LARGE: LLM = {
  modelId: "mistral-large",
  modelName: "Mistral Large (v2)",
  provider: "pollination",
  hostedId: "mistral-nemo-large",
  platformLink: "",
  imageInput: false
}

export const POLLINATION_LLM_LIST: LLM[] = [OPENAI, MISTRAL, MISTRAL_LARGE]
