/**
 * Standard API error helpers.
 *
 * The agreed error response format for AccessHub is:
 *   { "error": { "code": "SERVICE_NOT_FOUND", "message": "...", "details": {} } }
 *
 * Use these helpers so every endpoint returns the same shape. See docs/API_GUIDELINES.md.
 *
 * Workshop note: not every route uses these helpers yet — some still return ad-hoc
 * shapes like { message } or { error: "..." }. Standardizing them is a workshop task.
 */

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'SERVICE_NOT_FOUND'
  | 'ACCESS_REQUEST_NOT_FOUND'
  | 'API_KEY_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details: Record<string, unknown>;

  constructor(status: number, code: ErrorCode, message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  toResponse(): { error: { code: ErrorCode; message: string; details: Record<string, unknown> } } {
    return { error: { code: this.code, message: this.message, details: this.details } };
  }
}

export const badRequest = (message: string, details: Record<string, unknown> = {}): AppError =>
  new AppError(400, 'BAD_REQUEST', message, details);

export const unauthorized = (message = 'Authentication required'): AppError =>
  new AppError(401, 'UNAUTHORIZED', message);

export const forbidden = (message = 'You are not allowed to perform this action'): AppError =>
  new AppError(403, 'FORBIDDEN', message);

export const notFound = (code: ErrorCode, message: string): AppError => new AppError(404, code, message);

export const conflict = (message: string, details: Record<string, unknown> = {}): AppError =>
  new AppError(409, 'CONFLICT', message, details);
