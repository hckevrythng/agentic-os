export async function interpret(context) {
  const message = context.input?.message ?? "";
  const intent = message.includes("meeting") ? "schedule_event" : "unknown";
  return { intent, reasoning: "interpreted", entities: {} };
}
