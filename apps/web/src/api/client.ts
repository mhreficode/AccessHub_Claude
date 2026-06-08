/**
 * Minimal fetch wrapper. Adds the x-user-id header for the acting user
 * (chosen in the UserSwitcher) and normalizes error handling.
 */

let activeUserId: string | null = null;

export function setActiveUserId(id: string | null): void {
  activeUserId = id;
}

export function getActiveUserId(): string | null {
  return activeUserId;
}

interface ApiErrorBody {
  error?: { code?: string; message?: string } | string;
  message?: string;
}

function extractMessage(body: ApiErrorBody | null, fallback: string): string {
  if (!body) return fallback;
  if (typeof body.error === 'string') return body.error;
  if (body.error?.message) return body.error.message;
  if (body.message) return body.message;
  return fallback;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (activeUserId) headers.set('x-user-id', activeUserId);

  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  const body = text ? (JSON.parse(text) as unknown) : null;

  if (!res.ok) {
    throw new Error(extractMessage(body as ApiErrorBody, `Request failed (${res.status})`));
  }
  return body as T;
}
