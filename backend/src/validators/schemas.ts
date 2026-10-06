import { z } from 'zod';
import { isValidIndianPhone, isValidIndianPin } from '../utils/indiaConstants.js';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password is too long'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  phone: z
    .string()
    .refine((val) => !val || isValidIndianPhone(val), {
      message: 'Please provide a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)',
    })
    .optional()
    .nullable(),
  role: z.enum(['CUSTOMER', 'BAKERY']).default('CUSTOMER'),
  // Bakery specific fields if registering as a bakery
  bakeryName: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z
    .string()
    .refine((val) => !val || isValidIndianPin(val), {
      message: 'PIN code must be a valid 6-digit number (e.g. 380015)',
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .refine((val) => !val || isValidIndianPhone(val), {
      message: 'Please provide a valid 10-digit Indian mobile number',
    })
    .optional()
    .nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

// Bakery Schemas
export const updateBakerySchema = z.object({
  name: z.string().min(2).max(150).optional(),
  tagline: z.string().max(255).optional().nullable(),
  description: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  postalCode: z
    .string()
    .refine((val) => !val || isValidIndianPin(val), {
      message: 'PIN code must be a valid 6-digit number',
    })
    .optional(),
  phone: z
    .string()
    .refine((val) => !val || isValidIndianPhone(val), {
      message: 'Please provide a valid 10-digit Indian mobile number',
    })
    .optional(),
  email: z.string().email().optional(),
  logoUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  specialties: z.string().optional().nullable(),
  minimumLeadDays: z.number().int().min(1).max(30).optional(),
  isActive: z.boolean().optional(),
});

// Cake Schemas
export const cakeSchema = z.object({
  name: z.string().min(2, 'Cake name must be at least 2 characters').max(120),
  categoryId: z.number().int().positive().optional().nullable(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  basePrice: z.number().positive('Base price must be greater than 0'),
  preparationDays: z.number().int().min(1, 'Preparation time must be at least 1 day').default(2),
  imageUrl: z.string().min(1, 'Cake image is required'),
  galleryUrls: z.array(z.string()).optional(),
  isCustomizable: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
});

// Order Schemas
export const orderItemSchema = z.object({
  cakeId: z.number().int().positive().optional().nullable(),
  cakeName: z.string().min(1),
  cakeImage: z.string().optional().nullable(),
  basePrice: z.number().nonnegative(),
  quantity: z.number().int().positive().default(1),
  subtotal: z.number().nonnegative(),
  isCustom: z.boolean().default(false),
  customMessage: z.string().max(100).optional().nullable(),
  selectedOptions: z.record(z.any()).optional().nullable(),
});

export const createOrderSchema = z.object({
  bakeryId: z.number().int().positive('A valid bakery ID is required'),
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().refine(isValidIndianPhone, {
    message: 'Please provide a valid 10-digit Indian mobile number',
  }),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Delivery date must be YYYY-MM-DD'),
  deliveryTimeSlot: z.string().optional().nullable(),
  specialInstructions: z.string().max(500).optional().nullable(),
  paymentMethod: z
    .enum(['PAY_ON_DELIVERY', 'UPI_PAYMENT', 'CARD_PAYMENT', 'NET_BANKING', 'WALLET'])
    .default('PAY_ON_DELIVERY'),
  items: z.array(orderItemSchema).min(1, 'Order must contain at least one item'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'REJECTED',
    'CANCELLED',
  ]),
  rejectionReason: z.string().optional().nullable(),
}).refine(
  data => {
    if (data.status === 'REJECTED') {
      return !!data.rejectionReason && data.rejectionReason.trim().length >= 5;
    }
    return true;
  },
  {
    message: 'A detailed rejection reason (at least 5 characters) is required when rejecting an order.',
    path: ['rejectionReason'],
  }
);

// Review Schema
export const createReviewSchema = z.object({
  orderId: z.number().int().positive('Order ID is required'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5 stars'),
  comment: z.string().min(5, 'Please provide a helpful comment of at least 5 characters').max(1000),
});

export const replyReviewSchema = z.object({
  replyComment: z.string().min(2, 'Reply must be at least 2 characters').max(1000),
});
