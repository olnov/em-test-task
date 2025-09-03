import { z } from 'zod';

export const ExampleResponseSchema = z.object({
  message: z.string(),
});

export type ExampleResponseDto = z.infer<typeof ExampleResponseSchema>;
