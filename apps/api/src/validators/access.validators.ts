import { z } from 'zod';

export const createAccessRequestSchema = z.object({
  reason: z.string().min(10, 'A reason of at least 10 characters is required.'),
});

export const rejectAccessRequestSchema = z.object({
  rejectionReason: z.string().min(3, 'A rejection reason is required.'),
});

export type CreateAccessRequestInput = z.infer<typeof createAccessRequestSchema>;
export type RejectAccessRequestInput = z.infer<typeof rejectAccessRequestSchema>;
