import { db } from '../database/db.js';
import { Review } from '../types/index.js';
import { bakeryRepository } from './bakeryRepository.js';

export class ReviewRepository {
  public findById(id: number): Review | null {
    return db.queryOne<Review>(
      `SELECT r.*, u.full_name as customer_name, u.avatar_url as customer_avatar, b.name as bakery_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       JOIN bakeries b ON r.bakery_id = b.id
       WHERE r.id = ?`,
      [id]
    );
  }

  public findByOrderId(orderId: number): Review | null {
    return db.queryOne<Review>(
      `SELECT r.*, u.full_name as customer_name, u.avatar_url as customer_avatar, b.name as bakery_name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       JOIN bakeries b ON r.bakery_id = b.id
       WHERE r.order_id = ?`,
      [orderId]
    );
  }

  public findByBakery(
    bakeryId: number,
    params: { page?: number; limit?: number }
  ) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const countRes = db.queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM reviews WHERE bakery_id = ?',
      [bakeryId]
    );
    const total = countRes?.total || 0;

    const reviews = db.query<Review>(
      `SELECT r.*, u.full_name as customer_name, u.avatar_url as customer_avatar
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.bakery_id = ?
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [bakeryId, limit, offset]
    );

    return {
      reviews,
      total,
      page,
      limit,
    };
  }

  public create(data: {
    orderId: number;
    customerId: number;
    bakeryId: number;
    rating: number;
    comment: string;
  }): Review {
    const res = db.execute(
      `INSERT INTO reviews (order_id, customer_id, bakery_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [data.orderId, data.customerId, data.bakeryId, data.rating, data.comment]
    );

    // Refresh bakery average rating
    bakeryRepository.refreshRating(data.bakeryId);

    return this.findById(res.lastInsertRowid)!;
  }

  public reply(id: number, replyComment: string): Review | null {
    db.execute(
      'UPDATE reviews SET reply_comment = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [replyComment, id]
    );
    return this.findById(id);
  }
}

export const reviewRepository = new ReviewRepository();
