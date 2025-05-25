import { LLM } from "@/types"

export const OPENAI: LLM = {
  modelId: "openai",
  modelName: "OpenAI GPT-4.1-mini",
  provider: "pollination",
  hostedId: "openai",
  platformLink: "https://pollinations.ai",
  imageInput: true
}

export const OPENAI_LARGE: LLM = {
  modelId: "openai-large",
  modelName: "OpenAI GPT-4.1",
  provider: "pollination",
  hostedId: "openai-large",
  platformLink: "https://pollinations.ai",
  imageInput: true
}

export const QWEN_CODER: LLM = {
  modelId: "qwen-coder",
  modelName: "Qwen 2.5 Coder 32B",
  provider: "pollination",
  hostedId: "qwen-2.5-coder-32b",
  platformLink: "",
  imageInput: false
}

export const LLAMA: LLM = {
  modelId: "llama",
  modelName: "Llama 3.3 70B",
  provider: "pollination",
  hostedId: "llama",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const MISTRAL: LLM = {
  modelId: "mistral",
  modelName: "Mistral Small 3.1 24B",
  provider: "pollination",
  hostedId: "mistral",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const UNITY: LLM = {
  modelId: "unity",
  modelName: "Unity Unrestricted Agent (Mistral Small 3.1)",
  provider: "pollination",
  hostedId: "unity",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const MIDIJOURNEY: LLM = {
  modelId: "midijourney",
  modelName: "Midijourney musical transformer",
  provider: "pollination",
  hostedId: "midijourney-musical-transformer",
  platformLink: "",
  imageInput: false
}

export const RTIST: LLM = {
  modelId: "rtist",
  modelName: "Rtist image generator by @bqrio",
  provider: "pollination",
  hostedId: "rtist-image-generator-by-bqrio",
  platformLink: "",
  imageInput: false
}

export const SEARCHGPT: LLM = {
  modelId: "searchgpt",
  modelName: "SearchGPT with realtime news and web search",
  provider: "pollination",
  hostedId: "searchgpt-with-realtime-news-and-web-search",
  platformLink: "",
  imageInput: false
}

export const EVIL: LLM = {
  modelId: "evil",
  modelName: "Evil Mode - Experimental",
  provider: "pollination",
  hostedId: "evil-mode-experimental",
  platformLink: "",
  imageInput: false
}

export const DEEPSEEK: LLM = {
  modelId: "deepseek",
  modelName: "DeepSeek-V3",
  provider: "pollination",
  hostedId: "deepseek-v3",
  platformLink: "",
  imageInput: false
}

export const DEEPSEEK_REASONER: LLM = {
  modelId: "deepseek-reasoner",
  modelName: "DeepSeek R1 - Full",
  provider: "pollination",
  hostedId: "deepseek-r1-full",
  platformLink: "",
  imageInput: false
}

export const QWEN_REASONING: LLM = {
  modelId: "qwen-reasoning",
  modelName: "Qwen QWQ 32B - Advanced Reasoning",
  provider: "pollination",
  hostedId: "qwen-qwq-32b-advanced-reasoning",
  platformLink: "",
  imageInput: false
}

export const HORMOZ: LLM = {
  modelId: "hormoz",
  modelName: "Hormoz 8b by Muhammadreza Haghiri",
  provider: "pollination",
  hostedId: "hormoz-8b",
  platformLink: "",
  imageInput: false
}

export const HYPNOSIS_TRACY: LLM = {
  modelId: "hypnosis-tracy",
  modelName: "Hypnosis Tracy 7B - Self-help AI assistant",
  provider: "pollination",
  hostedId: "hypnosis-tracy-7b-self-help-ai-assistant",
  platformLink: "",
  imageInput: false
}

export const SUR: LLM = {
  modelId: "sur",
  modelName: "Sur AI Assistant",
  provider: "pollination",
  hostedId: "sur-ai-assistant",
  platformLink: "",
  imageInput: false
}

export const OPENAI_FAST: LLM = {
  modelId: "openai-fast",
  modelName: "OpenAI GPT-4.1-nano",
  provider: "pollination",
  hostedId: "openai-fast",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const OPENAI_ROBLOX: LLM = {
  modelId: "openai-roblox",
  modelName: "OpenAI GPT-4.1-mini for Roblox",
  provider: "pollination",
  hostedId: "openai-roblox",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const LLAMASCOUT: LLM = {
  modelId: "llamascout",
  modelName: "Llama 4 Scout 17B",
  provider: "pollination",
  hostedId: "llamascout",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const MIREXA: LLM = {
  modelId: "mirexa",
  modelName: "Mirexa AI Companion (GPT-4.1)",
  provider: "pollination",
  hostedId: "mirexa",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const PHI: LLM = {
  modelId: "phi",
  modelName: "Phi-4 Instruct",
  provider: "pollination",
  hostedId: "phi",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const GROK: LLM = {
  modelId: "grok",
  modelName: "xAi Grok-3 Mini",
  provider: "pollination",
  hostedId: "grok",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const BIDARA: LLM = {
  modelId: "bidara",
  modelName: "BIDARA - Biomimetic Designer and Research Assistant by NASA",
  provider: "pollination",
  hostedId: "bidara",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const OPENAI_AUDIO: LLM = {
  modelId: "openai-audio",
  modelName: "OpenAI GPT-4o-audio-preview",
  provider: "pollination",
  hostedId: "openai-audio",
  platformLink: "https://pollinations.ai",
  imageInput: false
}

export const POLLINATION_LLM_LIST: LLM[] = [
  OPENAI,
  OPENAI_FAST,
  OPENAI_LARGE,
  OPENAI_ROBLOX,
  QWEN_CODER,
  LLAMA,
  LLAMASCOUT,
  MISTRAL,
  UNITY,
  MIREXA,
  MIDIJOURNEY,
  RTIST,
  SEARCHGPT,
  EVIL,
  DEEPSEEK_REASONER,
  PHI,
  HORMOZ,
  HYPNOSIS_TRACY,
  DEEPSEEK,
  GROK,
  SUR,
  BIDARA,
  OPENAI_AUDIO
]
