import { env } from "../config/env.js";
import type { OpenClawRequest, OpenClawResponse } from "../types/api.js";

export async function askOpenClaw(prompt: string): Promise<string> {
  const payload: OpenClawRequest = {
    prompt,
  };

  void env.OPENCLAW_API_KEY;
  void payload;

  const fallbackResponse: OpenClawResponse = {
    result: `OpenClaw belum dihubungkan. Prompt diterima: ${prompt}`,
  };

  return fallbackResponse.result;
}
