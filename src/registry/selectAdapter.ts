import { PlannedAction } from "../types";

const registry: Record<string, any> = {
  "calendar.create": async (params: any) => ({
    result: { created: true, event: params },
    error: null
  }),
  "calendar.list": async (params: any) => ({
    result: { events: [] },
    error: null
  }),
  "system.log": async (params: any) => {
    console.log(`[${params.level}] ${params.message}`);
    return { result: { logged: true }, error: null };
  }
};

export function selectAdapter(actionType: string) {
  return registry[actionType] ?? null;
}
