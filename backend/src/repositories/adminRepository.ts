import { db } from '../database/db.js';

export class AdminRepository {
  public getPlatformMetrics() {
    const totalUsers = db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'CUSTOMER'")?.count || 0;
    const totalBakeries = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM bakeries')?.count || 0;
    const pendingBakeries = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM bakeries WHERE is_approved = 0')?.count || 0;
    const totalCakes = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM cakes WHERE is_active = 1')?.count || 0;
    const totalOrders = db.queryOne<{ count: number }>('SELECT COUNT(*) as count FROM orders')?.count || 0;
    const completedOrders = db.queryOne<{ count: number }>("SELECT COUNT(*) as count FROM orders WHERE status = 'DELIVERED'")?.count || 0;
    const totalGrossRevenue = db.queryOne<{ total: number }>("SELECT SUM(total_amount) as total FROM orders WHERE status = 'DELIVERED'")?.total || 0;

    const recentActivity = db.query<{
      id: number;
      type: string;
      title: string;
      created_at: string;
    }>(
      `SELECT id, 'ORDER' as type, ('Order #' || order_number || ' - $' || total_amount || ' (' || status || ')') as title, created_at FROM orders
       UNION ALL
       SELECT id, 'BAKERY' as type, ('Bakery Registered: ' || name) as title, created_at FROM bakeries
       ORDER BY created_at DESC LIMIT 10`
    );

    return {
      totalUsers,
      totalBakeries,
      pendingBakeries,
      totalCakes,
      totalOrders,
      completedOrders,
      totalGrossRevenue: Math.round(totalGrossRevenue * 100) / 100,
      recentActivity,
    };
  }
}

export const adminRepository = new AdminRepository();
