import { z } from 'zod';

export const updateServiceSchema = z.object({
  status: z.enum(['active', 'deprecated', 'maintenance']).optional(),
  description: z.string().min(1).optional(),
  docsMarkdown: z.string().optional(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
