import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const madeOrderSchema = z.object({
    none: z.string().optional(),
});

// generate form types from zod validation schema
export type MadeOrderInput = z.infer<typeof madeOrderSchema>;
