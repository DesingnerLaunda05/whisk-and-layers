import { db } from '../database/db.js';
import { Cake, CakeCategory } from '../types/index.js';

export class CakeRepository {
  public findById(id: number): Cake | null {
    return db.queryOne<Cake>(
      `SELECT c.*, b.name as bakery_name, b.city as bakery_city, cat.name as category_name
       FROM cakes c
       JOIN bakeries b ON c.bakery_id = b.id
       LEFT JOIN cake_categories cat ON c.category_id = cat.id
       WHERE c.id = ?`,
      [id]
    );
  }

  public findBySlug(slug: string): Cake | null {
    return db.queryOne<Cake>(
      `SELECT c.*, b.name as bakery_name, b.city as bakery_city, cat.name as category_name
       FROM cakes c
       JOIN bakeries b ON c.bakery_id = b.id
       LEFT JOIN cake_categories cat ON c.category_id = cat.id
       WHERE c.slug = ?`,
      [slug]
    );
  }

  public create(data: {
    bakeryId: number;
    categoryId?: number | null;
    name: string;
    slug: string;
    description: string;
    basePrice: number;
    preparationDays: number;
    imageUrl: string;
    galleryUrls?: string | null;
    isCustomizable?: boolean;
    isAvailable?: boolean;
  }): Cake {
    const res = db.execute(
      `INSERT INTO cakes (
        bakery_id, category_id, name, slug, description, base_price,
        preparation_days, image_url, gallery_urls, is_customizable, is_available, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        data.bakeryId,
        data.categoryId || null,
        data.name,
        data.slug,
        data.description,
        data.basePrice,
        data.preparationDays || 2,
        data.imageUrl,
        data.galleryUrls || null,
        data.isCustomizable ? 1 : 0,
        data.isAvailable !== false ? 1 : 0,
      ]
    );

    return this.findById(res.lastInsertRowid)!;
  }

  public update(
    id: number,
    data: {
      categoryId?: number | null;
      name?: string;
      slug?: string;
      description?: string;
      basePrice?: number;
      preparationDays?: number;
      imageUrl?: string;
      galleryUrls?: string | null;
      isCustomizable?: boolean;
      isAvailable?: boolean;
      isActive?: boolean;
    }
  ): Cake | null {
    const updates: string[] = [];
    const params: any[] = [];

    if (data.categoryId !== undefined) {
      updates.push('category_id = ?');
      params.push(data.categoryId);
    }
    if (data.name !== undefined) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.slug !== undefined) {
      updates.push('slug = ?');
      params.push(data.slug);
    }
    if (data.description !== undefined) {
      updates.push('description = ?');
      params.push(data.description);
    }
    if (data.basePrice !== undefined) {
      updates.push('base_price = ?');
      params.push(data.basePrice);
    }
    if (data.preparationDays !== undefined) {
      updates.push('preparation_days = ?');
      params.push(data.preparationDays);
    }
    if (data.imageUrl !== undefined) {
      updates.push('image_url = ?');
      params.push(data.imageUrl);
    }
    if (data.galleryUrls !== undefined) {
      updates.push('gallery_urls = ?');
      params.push(data.galleryUrls);
    }
    if (data.isCustomizable !== undefined) {
      updates.push('is_customizable = ?');
      params.push(data.isCustomizable ? 1 : 0);
    }
    if (data.isAvailable !== undefined) {
      updates.push('is_available = ?');
      params.push(data.isAvailable ? 1 : 0);
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

    db.execute(`UPDATE cakes SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  }

  public delete(id: number): boolean {
    // Soft delete / deactivate to preserve historical integrity
    const res = db.execute('UPDATE cakes SET is_active = 0 WHERE id = ?', [id]);
    return res.changes > 0;
  }

  public findAll(params: {
    bakeryId?: number;
    categoryId?: number;
    search?: string;
    customizableOnly?: boolean;
    availableOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest';
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE c.is_active = 1';
    const queryParams: any[] = [];

    if (params.bakeryId) {
      whereClause += ' AND c.bakery_id = ?';
      queryParams.push(params.bakeryId);
    }

    if (params.categoryId) {
      whereClause += ' AND c.category_id = ?';
      queryParams.push(params.categoryId);
    }

    if (params.availableOnly !== false) {
      whereClause += ' AND c.is_available = 1';
    }

    if (params.customizableOnly) {
      whereClause += ' AND c.is_customizable = 1';
    }

    if (params.minPrice !== undefined) {
      whereClause += ' AND c.base_price >= ?';
      queryParams.push(params.minPrice);
    }

    if (params.maxPrice !== undefined) {
      whereClause += ' AND c.base_price <= ?';
      queryParams.push(params.maxPrice);
    }

    if (params.search) {
      whereClause += ' AND (LOWER(c.name) LIKE ? OR LOWER(c.description) LIKE ? OR LOWER(b.name) LIKE ?)';
      const term = `%${params.search.toLowerCase()}%`;
      queryParams.push(term, term, term);
    }

    let orderBy = 'ORDER BY c.created_at DESC';
    if (params.sortBy === 'price_asc') orderBy = 'ORDER BY c.base_price ASC';
    if (params.sortBy === 'price_desc') orderBy = 'ORDER BY c.base_price DESC';
    if (params.sortBy === 'name') orderBy = 'ORDER BY c.name ASC';

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total
       FROM cakes c
       JOIN bakeries b ON c.bakery_id = b.id
       ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const cakes = db.query<Cake>(
      `SELECT c.*, b.name as bakery_name, b.city as bakery_city, cat.name as category_name
       FROM cakes c
       JOIN bakeries b ON c.bakery_id = b.id
       LEFT JOIN cake_categories cat ON c.category_id = cat.id
       ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    return {
      cakes,
      total,
      page,
      limit,
    };
  }

  public getCategories(): CakeCategory[] {
    return db.query<CakeCategory>('SELECT * FROM cake_categories ORDER BY sort_order ASC, name ASC');
  }
}

export const cakeRepository = new CakeRepository();
