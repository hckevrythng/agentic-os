import { Plan, PlannedAction } from "../types";

export function planActions(interpreted: {
  intent: string;
  reasoning: string;
  entities: Record<string, any>;
}): Plan {
  const actions: PlannedAction[] = [];

  if (interpreted.intent === "schedule_event") {
    actions.push({
      id: "action_1",
      type: "calendar.create",
      params: {
        date: interpreted.entities.date ?? null,
        time: interpreted.entities.time ?? null,
        title: interpreted.entities.title ?? "Meeting"
      },
      requires_permission: true
    });
  }

  if (interpreted.intent === "list_events") {
    actions.push({
      id: "action_1",
      type: "calendar.list",
      params: {
        range_start: interpreted.entities.range_start ?? null,
        range_end: interpreted.entities.range_end ?? null
      },
      requires_permission: true
    });
  }

  return {
    intent: interpreted.intent,
    reasoning: interpreted.reasoning,
    actions
  };
}
