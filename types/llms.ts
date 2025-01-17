import { ModelProvider } from "."
import { GPT4oAryahcr, QWENAryahcr } from "@/lib/models/llm/aryahcr-llm-list"

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | GroqLLMID
  | PerplexityLLMID
  | PollinationLLMID
  | BlackboxLLMID
  | AryahcrLLMID
  | AilsLLMID
  | ZanityLLMID
  | AirForceLLMID

// OpenAI Models (UPDATED 5/13/24)
export type OpenAILLMID =
  | "gpt-4o" // GPT-4o
  | "gpt-4-turbo-preview" // GPT-4 Turbo
  | "gpt-4-vision-preview" // GPT-4 Vision
  | "gpt-4" // GPT-4
  | "gpt-3.5-turbo" // Updated GPT-3.5 Turbo

// Google Models
export type GoogleLLMID =
  | "gemini-pro" // Gemini Pro
  | "gemini-pro-vision" // Gemini Pro Vision
  | "gemini-1.5-pro-latest" // Gemini 1.5 Pro
  | "gemini-1.5-flash" // Gemini 1.5 Flash

// Anthropic Models
export type AnthropicLLMID =
  | "claude-2.1" // Claude 2
  | "claude-instant-1.2" // Claude Instant
  | "claude-3-haiku-20240307" // Claude 3 Haiku
  | "claude-3-sonnet-20240229" // Claude 3 Sonnet
  | "claude-3-opus-20240229" // Claude 3 Opus
  | "claude-3-5-sonnet-20240620" // Claude 3.5 Sonnet

// Mistral Models
export type MistralLLMID =
  | "mistral-tiny" // Mistral Tiny
  | "mistral-small-latest" // Mistral Small
  | "mistral-medium-latest" // Mistral Medium
  | "mistral-large-latest" // Mistral Large

export type GroqLLMID =
  | "llama3-8b-8192" // LLaMA3-8b
  | "llama3-70b-8192" // LLaMA3-70b
  | "mixtral-8x7b-32768" // Mixtral-8x7b
  | "gemma-7b-it" // Gemma-7b IT

// Perplexity Models (UPDATED 1/31/24)
export type PerplexityLLMID =
  | "pplx-7b-online" // Perplexity Online 7B
  | "pplx-70b-online" // Perplexity Online 70B
  | "pplx-7b-chat" // Perplexity Chat 7B
  | "pplx-70b-chat" // Perplexity Chat 70B
  | "mixtral-8x7b-instruct" // Mixtral 8x7B Instruct
  | "mistral-7b-instruct" // Mistral 7B Instruct
  | "llama-2-70b-chat" // Llama2 70B Chat
  | "codellama-34b-instruct" // CodeLlama 34B Instruct
  | "codellama-70b-instruct" // CodeLlama 70B Instruct
  | "sonar-small-chat" // Sonar Small Chat
  | "sonar-small-online" // Sonar Small Online
  | "sonar-medium-chat" // Sonar Medium Chat
  | "sonar-medium-online" // Sonar Medium Online

export type PollinationLLMID =
  | "mistral"
  | "mistral-large"
  | "openai"
  | "claude"
  | "deepseek"
  | "qwen"
  | "qwen-coder"
  | "llama"
  | "unity"
  | "midijourney"
  | "rtist"
  | "searchgpt"
  | "evil"
  | "p1"

export type BlackboxLLMID = "" // No models available

export type AryahcrLLMID = "gpt-4o" | "Bing" | "blackbox" | "qwen-aryahcr"

export type AilsLLMID = "" // No models available

export type ZanityLLMID =
  | "gpt-4o:free"
  | "gpt-3.5-turbo"
  | "claude-3.5-sonnet:free"
  | "deepseek-coder-6.7b"
  | "deepseek-v2.5"

export type AirForceLLMID =
  | "deepseek-math-7b-instruct"
  | "openchat-3.5-0106"
  | "deepseek-coder-6.7b-base"
  | "deepseek-coder-6.7b-instruct"
  | "deepseek-math-7b-instruct"
  | "Nous-Hermes-2-Mixtral-8x7B-DPO"
  | "hermes-2-pro-mistral-7b"
  | "openhermes-2.5-mistral-7b"
  | "lfm-40b-moe"
  | "discolm-german-7b-v1"
  | "falcon-7b-instruct"
  | "llama-2-7b-chat-int8"
  | "llama-2-7b-chat-fp16"
  | "neural-chat-7b-v3-1"
  | "phi-2"
  | "sqlcoder-7b-2"
  | "tinyllama-1.1b-chat"
  | "zephyr-7b-beta"
  | "any-uncensored"
  | "llama-3.1-70b-chat"
  | "llama-3.1-8b-chat"
  | "llama-3.1-70b-turbo"
  | "llama-3.1-8b-turbo"

export interface LLM {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  imageInput: boolean
  pricing?: {
    currency: string
    unit: string
    inputCost: number
    outputCost?: number
  }
}

export interface OpenRouterLLM extends LLM {
  maxContext: number
}
