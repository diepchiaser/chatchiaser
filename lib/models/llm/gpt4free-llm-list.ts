import { LLM } from "@/types"
import { POLLINATION_LLM_LIST } from "@/lib/models/llm/pollination-llm-list"
import { BLACKBOX_LLM_LIST } from "@/lib/models/llm/blackbox-llm-list"
import { ARYAHR_LLM_LIST } from "@/lib/models/llm/aryahcr-llm-list"
import { AILS_LLM_LIST } from "@/lib/models/llm/ails-llm-list"
import { ZANITY_LLM_LIST } from "@/lib/models/llm/zanity-llm-list"
import { AIRFORCE_LLM_LIST } from "@/lib/models/llm/airforce-llm-list"

export const GPT4FREE_LLM_LIST: LLM[] = [
  POLLINATION_LLM_LIST,
  BLACKBOX_LLM_LIST,
  ARYAHR_LLM_LIST,
  AILS_LLM_LIST,
  ZANITY_LLM_LIST,
  AIRFORCE_LLM_LIST
].flat()
