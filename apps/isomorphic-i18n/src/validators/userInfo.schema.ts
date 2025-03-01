import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// form zod validation schema
export const userInfoSchema = z.object({
  firstName: z.string().min(1, { message: messages.firstNameRequired }),
  lastName: z.string().min(1, { message: messages.lastNameRequired }),
  email: validateEmail,
  phoneNumber: z
    .string({ required_error: messages.phoneNumberIsRequired })
    .min(2, { message: messages.phoneNumberIsRequired }),
});

// generate form types from zod validation schema
export type UserInfoInput = z.infer<typeof userInfoSchema>;
