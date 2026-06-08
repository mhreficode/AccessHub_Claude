/**
 * Date helpers, including partial support for the (workshop) access-expiration feature.
 */

/** Number of days after approval that access is considered expired. */
export const ACCESS_TTL_DAYS = 30;

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date.getTime());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/**
 * TODO(workshop): once AccessRequest has a persisted `expiresAt` column, this should
 * read that column instead of deriving the date from reviewedAt/createdAt.
 *
 * For now it derives a notional expiry from when the request was reviewed.
 */
export function notionalExpiry(reviewedAt: Date | null, createdAt: Date): Date {
  const start = reviewedAt ?? createdAt;
  return addDays(start, ACCESS_TTL_DAYS);
}

export function isExpired(expiresAt: Date, now: Date = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}
