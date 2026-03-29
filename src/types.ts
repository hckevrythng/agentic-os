export type UI =
  | { type: "text"; content: { message: string } }
  | { type: "card"; content: { title: string; body: string } }
  | { type: "list"; content: { items: string[] } }
  | { type: "form"; content: { fields: Array<{ id: string; label: string; type: string; required: boolean }> } }
  | { type: "error"; content: { message: string; code: string } }
  | { type: "none"; content: null };

export type ErrorObject = {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
};

export type LedgerAction = {
  id: string;
  type: string;
  status: "success" | "failed" | "skipped";
  reason?: string;
  result?: any;
  error?: ErrorObject;
};

export type LedgerEntry = {
  event: string;
  timestamp: string;
  reasoning: string;
  actions_taken: LedgerAction[];
  policy_checks: string[];
  memory_changes: { durable: any; session: any };
  errors: ErrorObject[];
};

export type IdentityState = {
  user_id: string;
  permissions: string[];
  preferences: Record<string, any>;
  traits: Record<string, any>;
  flags: string[];
};

export type SessionState = {
  history: Array<{ role: "user" | "assistant"; content: string }>;
  last_intent: string | null;
  slots: Record<string, any>;
  ephemeral_flags: string[];
  expires_at: string;
};

export type TaskState = {
  task_id: string;
  status: "idle" | "running" | "waiting" | "complete" | "error";
  step: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
} | null;

export type Environment = {
  mode: "user" | "system" | "automation";
  locale: string;
  timezone: string;
  platform: string;
  network: "online" | "offline" | "limited";
  app_version: string;
  capabilities: string[];
};

export type Context = {
  user: IdentityState;
  session: SessionState;
  environment: Environment;
  input: any;
};

export type PlannedAction = {
  id: string;
  type: string;
  params: any;
  requires_permission: boolean;
  depends_on?: string;
};

export type Plan = {
  intent: string;
  reasoning: string;
  actions: PlannedAction[];
};
