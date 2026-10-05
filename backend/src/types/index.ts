export type UserRole = 'CUSTOMER' | 'BAKERY' | 'ADMIN';

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'REJECTED'
  | 'CANCELLED';

export type PaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED';

export type CustomOptionType =
  | 'BASE'
  | 'FLAVOR'
  | 'SIZE'
  | 'SHAPE'
  | 'ICING'
  | 'TOPPING'
  | 'DECORATION';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserSafe {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Bakery {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email: string;
  logo_url: string | null;
  banner_url: string | null;
  specialties: string | null; // JSON string or comma separated
  rating_avg: number;
  review_count: number;
  is_approved: number;
  is_active: number;
  minimum_lead_days: number;
  created_at: string;
  updated_at: string;
}

export interface CakeCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

export interface Cake {
  id: number;
  bakery_id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string;
  base_price: number;
  preparation_days: number;
  image_url: string;
  gallery_urls: string | null; // JSON string
  is_customizable: number;
  is_available: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  bakery_name?: string;
  bakery_city?: string;
  category_name?: string;
}

export interface CustomizationOption {
  id: number;
  name: string;
  type: CustomOptionType;
  label: string;
  description: string | null;
  extra_price: number;
  image_url: string | null;
  is_active: number;
  sort_order: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  bakery_id: number;
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  status: OrderStatus;
  rejection_reason: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time_slot: string | null;
  special_instructions: string | null;
  payment_method: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer_email?: string;
  bakery_name?: string;
  bakery_phone?: string;
  bakery_address?: string;
  items?: OrderItem[];
  review?: Review | null;
}

export interface OrderItem {
  id: number;
  order_id: number;
  cake_id: number | null;
  cake_name: string;
  cake_image: string | null;
  base_price: number;
  quantity: number;
  subtotal: number;
  is_custom: number;
  custom_message: string | null;
  selected_options: string | null; // JSON snapshot
  created_at: string;
}

export interface Review {
  id: number;
  order_id: number;
  customer_id: number;
  bakery_id: number;
  rating: number;
  comment: string;
  reply_comment: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  customer_name?: string;
  customer_avatar?: string | null;
  bakery_name?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  link_url: string | null;
  is_read: number;
  created_at: string;
}

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: UserRole;
  fullName: string;
  bakeryId?: number | null;
}
