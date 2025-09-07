import { z } from 'zod';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const RegisterUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(255, 'First name must be 255 characters long max')
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, 'First name must contain only letters'),
  middleName: z
    .string()
    .min(2, 'Middle name must be at least 2 characters')
    .max(255, 'Middle name must be 255 characters long max')
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, 'Middle name must contain only letters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(255, 'Last name must be 255 characters long max')
    .regex(/^[a-zA-Zа-яА-ЯёЁ]+$/, 'Last name must contain only letters'),
  dateOfBirth: z.string().transform((s, ctx) => {
    const d = dayjs(s, 'DD.MM.YYYY', true);
    if (!d.isValid()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid dateOfBirth; use DD.MM.YYYY',
      });
      return z.NEVER;
    }
    return new Date(Date.UTC(d.year(), d.month(), d.date(), 12));
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be less than 20 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
