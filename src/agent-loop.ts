import { selectAdapter } from "./registry/selectAdapter";
import { capabilityAllowed } from "./capabilities/capabilityAllowed";
import { permissionAllowed } from "./capabilities/permissionAllowed";
import { auditorPre } from "./auditor/auditorPre";
import { auditorPost } from "./auditor/auditorPost";
import { assembleContext } from "./context/assembleContext";
import { interpret } from "./planner/interpret";
import { planActions } from "./planner/planActions";
import { IdentityState, SessionState, TaskState, Environment, LedgerEntry } from "./types";

export async function agentLoop(
  request: any,
  identityState: IdentityState,
  sessionState: SessionState,
  taskState: TaskState,
  environment: Environment
) {
  const context = assembleContext(request, identityState, sessionState, environment);
  const interpreted = await interpret(context);
  const plan = planActions(interpreted);

  const pre = auditorPre(plan, context);
  if (pre.status === "fail") {
    return {
      ui: { type: "error", content: { message: pre.errors[0].message, code: pre.errors[0].code } },
      agent_state: taskState,
      ledger_entry: pre.ledger,
      auditor_status: "fail"
    };
  }

  const ledger: LedgerEntry = {
    event: "action_execution",
    timestamp: new Date().toISOString(),
    reasoning: interpreted.reasoning,
    actions_taken: [],
    policy_checks: ["intent_check", "permission_check"],
    memory_changes: { durable: {}, session: {} },
    errors: []
  };

  const results: Record<string, any> = {};

  for (const action of plan.actions) {
    if (action.depends_on && !results[action.depends_on]) {
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "skipped", reason: "dependency_failed" });
      continue;
    }

    if (!capabilityAllowed(action, context)) {
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "skipped", reason: "capability_denied" });
      continue;
    }

    if (!permissionAllowed(action, context)) {
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "skipped", reason: "permission_denied" });
      ledger.errors.push({ code: "permission_denied", message: `Missing permission for ${action.type}`, retryable: false });
      continue;
    }

    const adapter = selectAdapter(action.type);
    if (!adapter) {
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "failed", reason: "adapter_not_found" });
      continue;
    }

    const response = await adapter(action.params);
    if (response.error) {
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "failed", error: response.error });
      ledger.errors.push(response.error);
    } else {
      results[action.id] = response.result;
      ledger.actions_taken.push({ id: action.id, type: action.type, status: "success", result: response.result });
    }
  }

  const post = auditorPost(ledger);

  return {
    intent: plan.intent,
    actions: plan.actions,
    memory_updates: { add: {}, remove: {}, session: {} },
    ledger_entry: ledger,
    ui: { type: "text", content: { message: `Completed: ${plan.intent}` } },
    agent_state: taskState,
    auditor_status: post.status
  };
}
