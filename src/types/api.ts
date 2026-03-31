export interface OpenClawResponse {
  reply?: string;
  message?: string;
}

export interface OpenClawAgentPayload {
  text?: string | null;
  mediaUrl?: string | null;
}

export interface OpenClawAgentResponse {
  payloads?: OpenClawAgentPayload[];
}
