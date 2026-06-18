import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
});

export const createEventSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  venue: z.string().min(1).max(255),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1),
  price: z.number().min(0),
  capacity: z.number().int().min(1),
  availableSeats: z.number().int().min(0),
  imageUrl: z.string().url().optional(),
  featured: z.boolean().optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const createBookingSchema = z.object({
  eventId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
  ticketType: z.enum(["General Admission", "VIP", "Early Bird"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
