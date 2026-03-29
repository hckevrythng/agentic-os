import Anthropic from "@anthropic-ai/sdk";
import { Context } from "../types";

const client = new Anthropic();

export async function interpret(context: Context): Promise<{
  intent: string;
  reasoning: string;
  entities: Record<string, any>;
}> {
  const message = context.input?.message ?? "";

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: `You are an intent classifier for an agentic OS.
Return JSON only, no markdown, no explanation.
Format: {"intent": "string", "reasoning": "string", "entities": {}}
Known intents: schedule_event, list_events, web_search, unknown.`,
    messages: [{ role: "user", content: message }]
  });

  try {
    return JSON.parse(
      (response.content[0] as { type: "text"; text: string }).text
    );
  } catch {
    return {
      intent: "unknown",
      reasoning: "Failed to parse model response.",
      entities: {}
    };
  }
}
