import { LLM } from "@/types"

export const DEEPSEEK_7B: LLM = {
  modelId: "deepseek-math-7b-instruct",
  modelName: "DeepSeek Math 7B Instruct",
  provider: "airforce",
  hostedId: "deepseek-math-7b-instruct",
  platformLink: "",
  imageInput: false
}

export const OPENCHAT_3_5_0106: LLM = {
  modelId: "openchat-3.5-0106",
  modelName: "OpenChat 3.5 0106",
  provider: "airforce",
  hostedId: "openchat-3.5-0106",
  platformLink: "",
  imageInput: false
}

export const AIRFORCE_LLM_LIST: LLM[] = [DEEPSEEK_7B, OPENCHAT_3_5_0106]
