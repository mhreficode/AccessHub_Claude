import type { NextFunction, Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import { unauthorized } from '../utils/errors';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  teamId: string | null;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}

/**
 * Simplified auth for the workshop: the frontend sends `x-user-id` identifying the
 * acting user (chosen in the UserSwitcher). The middleware loads that user and
 * attaches it as req.currentUser. Real authentication is out of scope.
 */
export async function currentUser(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.header('x-user-id');
    if (!userId) {
      throw unauthorized('Missing x-user-id header');
    }
    const user = await userRepository.findById(userId);
    if (!user) {
      throw unauthorized('Unknown user');
    }
    req.currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Convenience: throws if no current user is attached. */
export function requireUser(req: Request): CurrentUser {
  if (!req.currentUser) {
    throw unauthorized();
  }
  return req.currentUser;
}
