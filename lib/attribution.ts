const STORAGE_KEY = "wftpt_ticket_source";

export function sanitizeSource(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 200);
}

export function captureSource(): void {
  if (typeof window === "undefined") return;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (!raw) return;

  const sanitized = sanitizeSource(raw);
  if (!sanitized) return;

  window.localStorage.setItem(STORAGE_KEY, sanitized);
}

export function getSource(): string {
  if (typeof window === "undefined") return "direct";
  return window.localStorage.getItem(STORAGE_KEY) ?? "direct";
}
