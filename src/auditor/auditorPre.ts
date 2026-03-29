import { Plan, Context } from "../types";

export function auditorPre(plan: Plan, context: Context): {
  status: "pass" | "fail";
  errors: Array<{ code: string; message: string }>;
  ledger: any;
} {
  const errors: Array<{ code: string; message: string }> = [];

  if (!plan.intent) {
    errors.push({ code: "missing_intent", message: "Intent is required." });
  }

  for (const action of plan.actions) {
    if (!action.type) {
      errors.push({ code: "invalid_action", message: "Action missing type." });
    }
    if (action.requires_permission) {
      if (!context.user.permissions.includes(action.type.split(".")[0] + ".write") &&
          !context.user.permissions.includes(action.type)) {
        errors.push({
          code: "permission_denied",
          message: `Missing permission for ${action.type}`
        });
      }
    }
  }

  return {
    status: errors.length > 0 ? "fail" : "pass",
    errors,
    ledger: {
      event: "auditor_pre",
      timestamp: new Date().toISOString(),
      reasoning: "Pre-execution audit.",
      actions_taken: [],
      policy_checks: ["intent_check", "permission_check"],
      memory_changes: { durable: {}, session: {} },
      errors
    }
  };
}
