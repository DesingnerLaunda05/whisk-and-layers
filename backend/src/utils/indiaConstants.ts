/**
 * Whisk & Layers — Backend Indian Localization Utilities & Constants
 */

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

/**
 * Validates a 10-digit Indian mobile number.
 * Accepts: 9876543210, +91 9876543210, +91-9876543210, 09876543210.
 */
export function isValidIndianPhone(phone: string | null | undefined): boolean {
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
 * Normalizes phone number into "+91 XXXXXXXXXX" format.
 */
export function normalizeIndianPhone(phone: string | null | undefined): string {
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
  return phone.trim();
}

/**
 * Validates a 6-digit Indian PIN Code.
 */
export function isValidIndianPin(pin: string | null | undefined): boolean {
  if (!pin) return false;
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}
