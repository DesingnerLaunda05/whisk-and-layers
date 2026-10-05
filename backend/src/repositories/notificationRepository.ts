import { db } from '../database/db.js';
import { Notification } from '../types/index.js';

export class NotificationRepository {
  public findByUser(userId: number, limit = 20): Notification[] {
    return db.query<Notification>(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
  }

  public getUnreadCount(userId: number): number {
    const res = db.queryOne<{ count: number }>(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return res?.count || 0;
  }

  public create(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    linkUrl?: string | null;
  }): Notification {
    const res = db.execute(
      `INSERT INTO notifications (user_id, type, title, message, link_url, is_read)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [data.userId, data.type, data.title, data.message, data.linkUrl || null]
    );

    return db.queryOne<Notification>('SELECT * FROM notifications WHERE id = ?', [res.lastInsertRowid])!;
  }

  public markAsRead(id: number, userId: number): boolean {
    const res = db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, userId]);
    return res.changes > 0;
  }

  public markAllAsRead(userId: number): boolean {
    const res = db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    return res.changes > 0;
  }
}

export const notificationRepository = new NotificationRepository();
