import { agentLoop } from "./agent-loop";
import { IdentityState, SessionState, TaskState, Environment } from "./types";

async function main() {
  const identity: IdentityState = {
    user_id: "user_123",
    permissions: ["calendar.write"],
    preferences: { timezone: "America/Chicago" },
    traits: { expertise_level: "intermediate" },
    flags: []
  };

  const session: SessionState = {
    history: [],
    last_intent: null,
    slots: {},
    ephemeral_flags: [],
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
  };

  const task: TaskState = null;

  const environment: Environment = {
    mode: "user",
    locale: "en-US",
    timezone: "America/Chicago",
    platform: "android",
    network: "online",
    app_version: "1.0.0",
    capabilities: ["notifications"]
  };

  const request = {
    message: "Schedule a meeting for March 1st at 2 PM",
    timestamp: new Date().toISOString()
  };

  const response = await agentLoop(request, identity, session, task, environment);
  console.log(JSON.stringify(response, null, 2));
}

main().catch(console.error);
