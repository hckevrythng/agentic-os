import { PlannedAction, Context } from "../types";

export function permissionAllowed(action: PlannedAction, context: Context): boolean {
  if (!action.requires_permission) return true;
  return (
    context.user.permissions.includes(action.type) ||
    context.user.permissions.includes(action.type.split(".")[0] + ".write") ||
    context.user.permissions.includes(action.type.split(".")[0] + ".read")
  );
}
