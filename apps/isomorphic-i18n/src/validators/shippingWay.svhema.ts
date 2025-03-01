import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const shippingSchema = z.object({
  shipping: z.string().min(1, { message: "shippingWayRequired" }),
});

// generate form types from zod validation schema
export type ShippingInput = z.infer<typeof shippingSchema>;
