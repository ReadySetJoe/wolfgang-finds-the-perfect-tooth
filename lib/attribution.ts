const STORAGE_KEY = "wftpt_ticket_source";

export function sanitizeSource(raw: string): string {
  return raw.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 200);
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function captureSource(): void {
  const storage = getStorage();
  if (!storage) return;

  const raw = new URLSearchParams(window.location.search).get("src");
  if (!raw) return;

  const sanitized = sanitizeSource(raw);
  if (!sanitized) return;

  try {
    storage.setItem(STORAGE_KEY, sanitized);
  } catch {
    // Storage write blocked or full — attribution is lost, but checkout must not break.
  }
}

export function getSource(): string {
  const storage = getStorage();
  if (!storage) return "direct";

  try {
    const stored = storage.getItem(STORAGE_KEY);
    return (stored && sanitizeSource(stored)) || "direct";
  } catch {
    return "direct";
  }
}

/**
 * Capture then read, in one call. Self-sufficient regardless of whether a
 * parent component (e.g. _app.tsx) has already captured on this page load —
 * child effects run before parent effects in React, so a component reading
 * the source in its own effect cannot rely on that having happened yet.
 */
export function resolveSource(): string {
  captureSource();
  return getSource();
}
