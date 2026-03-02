import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  role: z.enum(['owner', 'worker']).default('owner'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(100),
  description: z.string().max(500).optional(),
  bountyAmount: z.number().min(1, 'Bounty must be at least $1').max(1000),
});

export const reportSchema = z.object({
  description: z.string().max(500).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  locationLat: z.number(),
  locationLng: z.number(),
});
