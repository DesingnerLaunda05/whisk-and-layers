/**
 * Whisk & Layers — India-First Localization Constants & Utilities
 * Centralized source of truth for Indian states, cities, currency, phone numbers, and PIN codes.
 */

export interface IndianCity {
  name: string;
  state: string;
  tier?: 1 | 2;
}

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const INDIAN_CITIES: IndianCity[] = [
  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat', tier: 1 },
  { name: 'Vadodara', state: 'Gujarat', tier: 2 },
  { name: 'Rajkot', state: 'Gujarat', tier: 2 },
  { name: 'Surat', state: 'Gujarat', tier: 1 },
  { name: 'Gandhinagar', state: 'Gujarat', tier: 2 },
  // Maharashtra
  { name: 'Mumbai', state: 'Maharashtra', tier: 1 },
  { name: 'Pune', state: 'Maharashtra', tier: 1 },
  { name: 'Nagpur', state: 'Maharashtra', tier: 2 },
  { name: 'Nashik', state: 'Maharashtra', tier: 2 },
  // Karnataka
  { name: 'Bengaluru', state: 'Karnataka', tier: 1 },
  { name: 'Mysuru', state: 'Karnataka', tier: 2 },
  // Delhi NCR
  { name: 'Delhi', state: 'Delhi', tier: 1 },
  { name: 'New Delhi', state: 'Delhi', tier: 1 },
  // Rajasthan
  { name: 'Jaipur', state: 'Rajasthan', tier: 1 },
  { name: 'Udaipur', state: 'Rajasthan', tier: 2 },
  { name: 'Jodhpur', state: 'Rajasthan', tier: 2 },
  // Telangana
  { name: 'Hyderabad', state: 'Telangana', tier: 1 },
  // Tamil Nadu
  { name: 'Chennai', state: 'Tamil Nadu', tier: 1 },
  { name: 'Coimbatore', state: 'Tamil Nadu', tier: 2 },
  // West Bengal
  { name: 'Kolkata', state: 'West Bengal', tier: 1 },
  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', tier: 1 },
  { name: 'Noida', state: 'Uttar Pradesh', tier: 1 },
  // Kerala
  { name: 'Kochi', state: 'Kerala', tier: 2 },
  { name: 'Thiruvananthapuram', state: 'Kerala', tier: 2 },
  // Madhya Pradesh
  { name: 'Indore', state: 'Madhya Pradesh', tier: 2 },
  { name: 'Bhopal', state: 'Madhya Pradesh', tier: 2 },
];

/**
 * Validates a 10-digit Indian mobile number.
 * Accepts formats: 9876543210, +91 9876543210, +91-9876543210, 09876543210.
 * National number must start with 6, 7, 8, or 9.
 */
export function validateIndianPhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^[6-9]\d{9}$/.test(digits.slice(2));
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return /^[6-9]\d{9}$/.test(digits.slice(1));
  }
  return false;
}

/**
 * Normalizes phone numbers to standard "+91 XXXXXXXXXX" format.
 */
export function formatIndianPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  let nationalNumber = digits;
  if (digits.length === 12 && digits.startsWith('91')) {
    nationalNumber = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    nationalNumber = digits.slice(1);
  }
  if (nationalNumber.length === 10) {
    return `+91 ${nationalNumber}`;
  }
  return phone;
}

export function normalizeIndianPhone(phone: string): string {
  return formatIndianPhone(phone);
}

/**
 * Validates a 6-digit Indian Postal Index Number (PIN Code).
 * Cannot start with 0.
 */
export function validateIndianPin(pin: string): boolean {
  if (!pin) return false;
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}

/**
 * Formats a numeric price into standard Indian Rupee notation (₹).
 * Examples: 850 -> "₹850", 1250 -> "₹1,250", 125000 -> "₹1,25,000".
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  const isFractional = amount % 1 !== 0;
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: isFractional ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Standard Indian date formatting (IST).
 * Example: "06 Oct 2026"
 */
export function formatIndianDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return String(dateInput);
  }
}

/**
 * Standard Indian date & time formatting (IST).
 * Example: "06 Oct 2026, 04:30 PM IST"
 */
export function formatIndianDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '—';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);
    return (
      d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }) + ' IST'
    );
  } catch {
    return String(dateInput);
  }
}

/**
 * Standard cake sizes in Kilograms for Indian market.
 */
export const INDIAN_CAKE_SIZES = [
  { label: '0.5 Kg', serves: '3–4 guests', weightKg: 0.5, desc: 'Ideal for intimate birthdays & mini celebrations' },
  { label: '1 Kg', serves: '6–8 guests', weightKg: 1.0, desc: 'Our most popular size for family gatherings' },
  { label: '1.5 Kg', serves: '10–12 guests', weightKg: 1.5, desc: 'Perfect for lively milestone celebrations' },
  { label: '2 Kg', serves: '14–16 guests', weightKg: 2.0, desc: 'Grand party centerpiece' },
  { label: '3 Kg (2-Tier)', serves: '22–26 guests', weightKg: 3.0, desc: 'Showstopper tiered celebration tower' },
];
