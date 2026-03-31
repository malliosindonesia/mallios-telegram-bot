import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import type { OpenClawAgentResponse } from "../types/api.js";
import { describeError, logger } from "../utils/logger.js";

const execFileAsync = promisify(execFile);
const defaultOpenClawBin = join(homedir(), ".local", "bin", "openclaw");

export async function askOpenClaw(
  prompt: string,
  sessionId: string,
): Promise<string> {
  const openClawBin = resolveOpenClawBin();
  const startTime = Date.now();

  logger.trace("Launching OpenClaw process", {
    sessionId,
    bin: openClawBin,
    prompt,
  });

  try {
    const { stdout, stderr } = await execFileAsync(
      openClawBin,
      [
        "--log-level",
        "silent",
        "agent",
        "--local",
        "--session-id",
        sessionId,
        "--message",
        prompt,
        "--json",
      ],
      {
        timeout: 90_000,
        maxBuffer: 1024 * 1024 * 5,
      },
    );

    const rawOutput = pickJsonPayload(stdout, stderr);
    const data = JSON.parse(rawOutput) as OpenClawAgentResponse;
    const answer = data.payloads?.find((payload) => payload.text?.trim())?.text;

    if (!answer) {
      throw new Error("OpenClaw tidak mengembalikan jawaban teks.");
    }

    logger.success("OpenClaw finished cleanly", {
      sessionId,
      durationMs: Date.now() - startTime,
      answerLength: answer.length,
    });

    return answer;
  } catch (error) {
    logger.error("OpenClaw request failed", {
      sessionId,
      durationMs: Date.now() - startTime,
      ...describeError(error),
    });
    throw error;
  }
}

function resolveOpenClawBin(): string {
  if (process.env.OPENCLAW_BIN?.trim()) {
    return process.env.OPENCLAW_BIN.trim();
  }

  if (existsSync(defaultOpenClawBin)) {
    return defaultOpenClawBin;
  }

  return "openclaw";
}

function pickJsonPayload(stdout: string, stderr: string): string {
  const candidates = [stdout, stderr, `${stdout}\n${stderr}`]
    .map((value) => value.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");

    if (start >= 0 && end > start) {
      return candidate.slice(start, end + 1);
    }
  }

  throw new Error(
    `OpenClaw tidak mengembalikan JSON yang valid. stdout="${stdout.trim()}" stderr="${stderr.trim()}"`,
  );
}
