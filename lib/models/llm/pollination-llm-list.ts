import { LLM } from "@/types"

export const OPENAI: LLM = {
  modelId: "openai",
  modelName: "OpenAI GPT-4o-mini",
  provider: "pollination",
  hostedId: "OpenAI GPT-4o-mini",
  platformLink: "",
  imageInput: true
}

export const OPENAI_LARGE: LLM = {
  modelId: "openai-large",
  modelName: "OpenAI GPT-4o",
  provider: "pollination",
  hostedId: "OpenAI GPT-4o",
  platformLink: "",
  imageInput: true
}

export const QWEN: LLM = {
  modelId: "qwen",
  modelName: "Qwen 2.5 72B",
  provider: "pollination",
  hostedId: "qwen-2.5-72b",
  platformLink: "",
  imageInput: true
}

export const QWEN_CODER: LLM = {
  modelId: "qwen-coder",
  modelName: "Qwen 2.5 Coder 32B",
  provider: "pollination",
  hostedId: "qwen-2.5-coder-32b",
  platformLink: "",
  imageInput: true
}

export const LLAMA: LLM = {
  modelId: "llama",
  modelName: "Llama 3.3 70B",
  provider: "pollination",
  hostedId: "llama-3.3-70b",
  platformLink: "",
  imageInput: false
}

export const MISTRAL: LLM = {
  modelId: "mistral",
  modelName: "Mistral Nemo",
  provider: "pollination",
  hostedId: "mistral-nemo",
  platformLink: "",
  imageInput: true
}

export const LLAMA_COMPLETION: LLM = {
  modelId: "llama",
  modelName: "Llama 3.1",
  provider: "pollination",
  hostedId: "llama-3.1",
  platformLink: "",
  imageInput: false
}

export const UNITY: LLM = {
  modelId: "unity",
  modelName: "Unity with Mistral Large by Unity AI Lab",
  provider: "pollination",
  hostedId: "unity-with-mistral-large-by-unity-ai-lab",
  platformLink: "",
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

export const P1: LLM = {
  modelId: "p1",
  modelName: "Pollinations 1 (OptiLLM)",
  provider: "pollination",
  hostedId: "pollinations-1-optiLLM",
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

export const LLAMALIGHT: LLM = {
  modelId: "llamalight",
  modelName: "Llama 3.1 8B Instruct",
  provider: "pollination",
  hostedId: "llama-3.1-8b-instruct",
  platformLink: "",
  imageInput: true
}

export const CLAUDE_HYBRIDSPACE: LLM = {
  modelId: "claude-hybridspace",
  modelName: "Claude Hybridspace",
  provider: "pollination",
  hostedId: "claude-hybridspace",
  platformLink: "",
  imageInput: true
}

export const POLLINATION_LLM_LIST: LLM[] = [
  OPENAI,
  QWEN,
  QWEN_CODER,
  LLAMA,
  MISTRAL,
  LLAMA_COMPLETION,
  UNITY,
  MIDIJOURNEY,
  RTIST,
  SEARCHGPT,
  EVIL,
  P1,
  DEEPSEEK,
  OPENAI_LARGE,
  LLAMALIGHT,
  CLAUDE_HYBRIDSPACE
]
