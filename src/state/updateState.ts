import { TaskState } from "../types";

export function updateState(current: TaskState, updates: Partial<NonNullable<TaskState>>): TaskState {
  if (!current) return null;
  return {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };
}
