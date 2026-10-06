import { userRepository } from '../repositories/userRepository.js';
import { bakeryRepository } from '../repositories/bakeryRepository.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { UserSafe, UserRole } from '../types/index.js';
import { normalizeIndianPhone } from '../utils/indiaConstants.js';

export class AuthService {
  public async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string | null;
    role: UserRole;
    bakeryName?: string;
    tagline?: string;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }) {
    const existing = userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const user = userRepository.create({
      email: data.email,
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    });

    let bakeryId: number | null = null;
    if (data.role === 'BAKERY') {
      const slug = (data.bakeryName || data.fullName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

      const bakery = bakeryRepository.create({
        userId: user.id,
        name: data.bakeryName || `${data.fullName}'s Bakery`,
        slug,
        tagline: data.tagline || 'Artisanal bakes made with passion',
        description: data.description || 'Welcome to our bakery on Whisk & Layers.',
        address: data.address || 'Address pending update',
        city: data.city || 'Ahmedabad',
        state: data.state || 'Gujarat',
        postalCode: data.postalCode || '380015',
        phone: data.phone ? normalizeIndianPhone(data.phone) : '+91 9876543210',
        email: data.email,
      });
      bakeryId = bakery.id;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      bakeryId,
    });

    return { user, token, bakeryId };
  }

  public async login(email: string, password: string) {
    const user = userRepository.findByEmail(email);
    if (!user || user.is_active !== 1) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    let bakeryId: number | null = null;
    if (user.role === 'BAKERY') {
      const bakery = bakeryRepository.findByUserId(user.id);
      bakeryId = bakery?.id || null;
    }

    const safeUser: UserSafe = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      is_active: user.is_active === 1,
      created_at: user.created_at,
    };

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      bakeryId,
    });

    return { user: safeUser, token, bakeryId };
  }

  public getMe(userId: number) {
    const user = userRepository.findSafeById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    let bakery = null;
    if (user.role === 'BAKERY') {
      bakery = bakeryRepository.findByUserId(user.id);
    }

    return { user, bakery };
  }

  public updateProfile(
    userId: number,
    data: { fullName?: string; phone?: string | null; avatarUrl?: string | null }
  ) {
    const updated = userRepository.update(userId, data);
    if (!updated) {
      throw new Error('User not found.');
    }
    return updated;
  }
}

export const authService = new AuthService();
