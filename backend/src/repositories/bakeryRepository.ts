import { db } from '../database/db.js';
import { Bakery } from '../types/index.js';

export class BakeryRepository {
  public findById(id: number): Bakery | null {
    return db.queryOne<Bakery>('SELECT * FROM bakeries WHERE id = ?', [id]);
  }

  public findByUserId(userId: number): Bakery | null {
    return db.queryOne<Bakery>('SELECT * FROM bakeries WHERE user_id = ?', [userId]);
  }

  public findBySlug(slug: string): Bakery | null {
    return db.queryOne<Bakery>('SELECT * FROM bakeries WHERE slug = ?', [slug]);
  }

  public create(data: {
    userId: number;
    name: string;
    slug: string;
    tagline?: string | null;
    description: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    email: string;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    specialties?: string | null;
    minimumLeadDays?: number;
  }): Bakery {
    const res = db.execute(
      `INSERT INTO bakeries (
        user_id, name, slug, tagline, description, address, city, state, postal_code,
        phone, email, logo_url, banner_url, specialties, minimum_lead_days, is_approved, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)`,
      [
        data.userId,
        data.name,
        data.slug,
        data.tagline || null,
        data.description,
        data.address,
        data.city,
        data.state,
        data.postalCode,
        data.phone,
        data.email,
        data.logoUrl || null,
        data.bannerUrl || null,
        data.specialties || null,
        data.minimumLeadDays || 2,
      ]
    );

    return this.findById(res.lastInsertRowid)!;
  }

  public update(
    id: number,
    data: {
      name?: string;
      slug?: string;
      tagline?: string | null;
      description?: string;
      address?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      phone?: string;
      email?: string;
      logoUrl?: string | null;
      bannerUrl?: string | null;
      specialties?: string | null;
      minimumLeadDays?: number;
      isApproved?: boolean;
      isActive?: boolean;
      ratingAvg?: number;
      reviewCount?: number;
    }
  ): Bakery | null {
    const updates: string[] = [];
    const params: any[] = [];

    const fieldMap: Record<string, string> = {
      name: 'name',
      slug: 'slug',
      tagline: 'tagline',
      description: 'description',
      address: 'address',
      city: 'city',
      state: 'state',
      postalCode: 'postal_code',
      phone: 'phone',
      email: 'email',
      logoUrl: 'logo_url',
      bannerUrl: 'banner_url',
      specialties: 'specialties',
      minimumLeadDays: 'minimum_lead_days',
      ratingAvg: 'rating_avg',
      reviewCount: 'review_count',
    };

    for (const [key, dbCol] of Object.entries(fieldMap)) {
      if ((data as any)[key] !== undefined) {
        updates.push(`${dbCol} = ?`);
        params.push((data as any)[key]);
      }
    }

    if (data.isApproved !== undefined) {
      updates.push('is_approved = ?');
      params.push(data.isApproved ? 1 : 0);
    }
    if (data.isActive !== undefined) {
      updates.push('is_active = ?');
      params.push(data.isActive ? 1 : 0);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.execute(`UPDATE bakeries SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  public findAll(params: {
    search?: string;
    city?: string;
    specialty?: string;
    sortBy?: 'rating' | 'reviews' | 'name' | 'newest';
    approvedOnly?: boolean;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (params.approvedOnly !== false) {
      whereClause += ' AND is_approved = 1 AND is_active = 1';
    }

    if (params.search) {
      whereClause += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(specialties) LIKE ? OR LOWER(city) LIKE ?)';
      const term = `%${params.search.toLowerCase()}%`;
      queryParams.push(term, term, term, term);
    }

    if (params.city) {
      whereClause += ' AND LOWER(city) = LOWER(?)';
      queryParams.push(params.city);
    }

    if (params.specialty) {
      whereClause += ' AND LOWER(specialties) LIKE ?';
      queryParams.push(`%${params.specialty.toLowerCase()}%`);
    }

    let orderBy = 'ORDER BY rating_avg DESC, review_count DESC';
    if (params.sortBy === 'name') orderBy = 'ORDER BY name ASC';
    if (params.sortBy === 'reviews') orderBy = 'ORDER BY review_count DESC';
    if (params.sortBy === 'newest') orderBy = 'ORDER BY created_at DESC';

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM bakeries ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const bakeries = db.query<Bakery>(
      `SELECT * FROM bakeries ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return {
      bakeries,
      total,
      page,
      limit,
    };
  }

  public refreshRating(bakeryId: number) {
    const stats = db.queryOne<{ avgRating: number; count: number }>(
      'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE bakery_id = ?',
      [bakeryId]
    );
    if (stats) {
      const ratingAvg = stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : 0;
      db.execute(
        'UPDATE bakeries SET rating_avg = ?, review_count = ? WHERE id = ?',
        [ratingAvg, stats.count || 0, bakeryId]
      );
    }
  }
}

export const bakeryRepository = new BakeryRepository();
