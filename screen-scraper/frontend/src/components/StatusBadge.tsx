import type { ProbeStatus } from "../types";

export function StatusBadge({ status }: { status: ProbeStatus }) {
  return <span className={`status-badge status-${status}`}>{status}</span>;
}
