import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { userRepository } from '../repositories/user.repository';
import { requireUser } from '../middleware/currentUser';

/** Public router: list of users for the UserSwitcher (no auth required). */
export const usersRouter = Router();

usersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const users = await userRepository.findAll();
    res.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        team: u.team?.name ?? null,
      })),
    );
  }),
);

/** Authenticated router: the current user. */
export const meRouter = Router();

meRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(requireUser(req));
  }),
);
