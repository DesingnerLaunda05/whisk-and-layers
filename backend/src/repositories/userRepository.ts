import { db } from '../database/db.js';
import { User, UserSafe, UserRole } from '../types/index.js';

export class UserRepository {
  public findById(id: number): User | null {
    return db.queryOne<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  public findSafeById(id: number): UserSafe | null {
    const user = this.findById(id);
    if (!user) return null;
    return this.toSafeUser(user);
  }

  public findByEmail(email: string): User | null {
    return db.queryOne<User>('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
  }

  public create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string | null;
    role: UserRole;
    avatarUrl?: string | null;
  }): UserSafe {
    const res = db.execute(
      `INSERT INTO users (email, password_hash, full_name, phone, role, avatar_url, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [
        data.email.toLowerCase(),
        data.passwordHash,
        data.fullName,
        data.phone || null,
        data.role,
        data.avatarUrl || null,
      ]
    );

    const created = this.findById(res.lastInsertRowid);
    return this.toSafeUser(created!);
  }

  public update(
    id: number,
    data: {
      fullName?: string;
      phone?: string | null;
      avatarUrl?: string | null;
      isActive?: boolean;
    }
  ): UserSafe | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.fullName !== undefined) {
      updates.push('full_name = ?');
      params.push(data.fullName);
    }
    if (data.phone !== undefined) {
      updates.push('phone = ?');
      params.push(data.phone);
    }
    if (data.avatarUrl !== undefined) {
      updates.push('avatar_url = ?');
      params.push(data.avatarUrl);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(data.isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findSafeById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findSafeById(id);
  }

  public findAll(params: { search?: string; role?: string; page?: number; limit?: number }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (params.search) {
      whereClause += ' AND (LOWER(full_name) LIKE ? OR LOWER(email) LIKE ?)';
      const term = `%${params.search.toLowerCase()}%`;
      queryParams.push(term, term);
    }

    if (params.role) {
      whereClause += ' AND role = ?';
      queryParams.push(params.role);
    }

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const users = db.query<User>(
      `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return {
      users: users.map(u => this.toSafeUser(u)),
      total,
      page,
      limit,
    };
  }

  private toSafeUser(user: User): UserSafe {
    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url,
      is_active: user.is_active === 1,
      created_at: user.created_at,
    };
  }
}

export const userRepository = new UserRepository();
