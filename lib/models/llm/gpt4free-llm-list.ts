import { LLM } from "@/types"
import { POLLINATION_LLM_LIST } from "@/lib/models/llm/pollination-llm-list"
import { BLACKBOX_LLM_LIST } from "@/lib/models/llm/blackbox-llm-list"
import { ARYAHR_LLM_LIST } from "@/lib/models/llm/aryahcr-llm-list"

export const GPT4FREE_LLM_LIST: LLM[] = [
  POLLINATION_LLM_LIST,
  BLACKBOX_LLM_LIST,
  ARYAHR_LLM_LIST
].flat()
