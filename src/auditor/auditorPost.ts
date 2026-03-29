export function auditorPost(ledger) {
  const errors = [];

  if (!ledger.reasoning || ledger.reasoning.trim() === "") {
    errors.push({ code: "missing_reasoning", message: "Ledger reasoning is empty." });
  }

  if (!ledger.timestamp) {
    errors.push({ code: "missing_timestamp", message: "Ledger timestamp is missing." });
  }

  if (!ledger.event) {
    errors.push({ code: "missing_event", message: "Ledger event is missing." });
  }

  return {
    status: errors.length > 0 ? "fail" : "pass",
    errors
  };
}
