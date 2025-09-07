import { z } from 'zod';

export const UserIdSchema = z.string().trim().uuid('Invalid UUID format');
export type UserIdDto = z.infer<typeof UserIdSchema>;

export const UserRoleSchema = z
  .string()
  .transform((s) => s.toLowerCase())
  .pipe(z.enum(['admin', 'user']));
export type UserRoleDto = z.infer<typeof UserRoleSchema>;
