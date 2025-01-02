import { LLM } from "@/types"

export const GPT_4_0_FREE: LLM = {
  modelId: "gpt-4o:free",
  modelName: "GPT-4o",
  provider: "zanity",
  hostedId: "gpt-4o-free",
  platformLink: "",
  imageInput: false
}

export const GPT_3_5_TURBO: LLM = {
  modelId: "gpt-3.5-turbo",
  modelName: "GPT-3.5 Turbo",
  provider: "zanity",
  hostedId: "gpt-3.5-turbo",
  platformLink: "",
  imageInput: false
}

export const CLAUDE_3_5_SONNET_FREE: LLM = {
  modelId: "claude-3.5-sonnet:free",
  modelName: "Claude 3.5 Sonnet",
  provider: "zanity",
  hostedId: "claude-3-5-sonnet-free",
  platformLink: "",
  imageInput: false
}

export const DEEPSEEK_CODER_6_7B: LLM = {
  modelId: "deepseek-coder-6.7b",
  modelName: "DeepSeek Coder 6.7B",
  provider: "zanity",
  hostedId: "deepseek-coder-6.7b",
  platformLink: "",
  imageInput: false
}

export const DEEPSEEK_V2_5: LLM = {
  modelId: "deepseek-v2.5",
  modelName: "DeepSeek v2.5",
  provider: "zanity",
  hostedId: "deepseek-v2.5",
  platformLink: "",
  imageInput: false
}

export const ZANITY_LLM_LIST: LLM[] = [
  GPT_4_0_FREE,
  GPT_3_5_TURBO,
  CLAUDE_3_5_SONNET_FREE,
  DEEPSEEK_CODER_6_7B,
  DEEPSEEK_V2_5
]
