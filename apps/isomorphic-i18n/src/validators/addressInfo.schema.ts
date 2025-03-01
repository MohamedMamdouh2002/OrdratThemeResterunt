import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const addressInfoSchema = z.object({
  countryId: z.string().min(1, { message: 'countryIdRequired' }),
  streetName: z.string().min(1, { message: 'streetNameRequired' }),
  neighborhoodName: z.string().min(1, { message: 'neighborhoodNameRequired' }),
  buildingNumber: z.string().min(1, { message: 'buildingNumberRequired' }),
  postalCode: z.string().min(1, { message: 'postalCodeRequired' }),
  cityName: z.string().min(1, { message: 'postalCodeRequired' }),
});

// generate form types from zod validation schema
export type AddressInfoInput = z.infer<typeof addressInfoSchema>;
