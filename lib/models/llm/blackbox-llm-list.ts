import { LLM } from "@/types"

export const OPENAI_B: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "blackbox",
  hostedId: "openai-gpt-4o",
  platformLink: "",
  imageInput: false
}

export const CLAUDE_SONNET_B: LLM = {
  modelId: "claude-sonnet-3.5",
  modelName: "Claude Sonnet 3.5",
  provider: "blackbox",
  hostedId: "claude-sonnet-3.5",
  platformLink: "",
  imageInput: false
}

export const BLACKBOX_LLM_LIST: LLM[] = [OPENAI_B, CLAUDE_SONNET_B]
