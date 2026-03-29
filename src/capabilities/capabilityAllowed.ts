import { PlannedAction, Context } from "../types";

export function capabilityAllowed(action: PlannedAction, context: Context): boolean {
  const network = context.environment.network;
  if (action.type === "web.search" && network === "offline") return false;
  return true;
}
