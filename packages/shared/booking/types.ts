// packages/shared/booking/types.ts
import { z } from 'zod';

export const ISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const BookingInputSchema = z.object({
  tripId: z.string().min(1),
  attempt: z.number().int().positive().default(1),
  paymentIntentId: z.string().min(1).optional(),
  searchParams: z.object({
    origin: z.string().min(3),
    destination: z.string().min(3),
    date: ISODate,
    maxPrice: z.number().int().positive()
  }),
  traveler: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    dateOfBirth: ISODate
  })
});

export type BookingInput = z.infer<typeof BookingInputSchema>;

export const BookingOutputSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(['SUCCEEDED', 'FAILED', 'PENDING']),
  correlationId: z.string().min(1),
  message: z.string().optional()
});

export type BookingOutput = z.infer<typeof BookingOutputSchema>;

