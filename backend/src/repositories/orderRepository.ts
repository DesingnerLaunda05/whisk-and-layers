import { db } from '../database/db.js';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '../types/index.js';

export class OrderRepository {
  public findById(id: number): Order | null {
    const order = db.queryOne<Order>(
      `SELECT o.*, u.email as customer_email, b.name as bakery_name, b.phone as bakery_phone, b.address as bakery_address
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       JOIN bakeries b ON o.bakery_id = b.id
       WHERE o.id = ?`,
      [id]
    );

    if (!order) return null;

    order.items = this.getOrderItems(order.id);
    return order;
  }

  public findByOrderNumber(orderNumber: string): Order | null {
    const order = db.queryOne<Order>(
      `SELECT o.*, u.email as customer_email, b.name as bakery_name, b.phone as bakery_phone, b.address as bakery_address
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       JOIN bakeries b ON o.bakery_id = b.id
       WHERE o.order_number = ?`,
      [orderNumber]
    );

    if (!order) return null;

    order.items = this.getOrderItems(order.id);
    return order;
  }

  public getOrderItems(orderId: number): OrderItem[] {
    return db.query<OrderItem>(
      'SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC',
      [orderId]
    );
  }

  public create(data: {
    customerId: number;
    bakeryId: number;
    subtotal: number;
    deliveryFee: number;
    taxAmount: number;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTimeSlot?: string | null;
    specialInstructions?: string | null;
    paymentMethod: string;
    items: Array<{
      cakeId?: number | null;
      cakeName: string;
      cakeImage?: string | null;
      basePrice: number;
      quantity: number;
      subtotal: number;
      isCustom?: boolean;
      customMessage?: string | null;
      selectedOptions?: any;
    }>;
  }): Order {
    return db.transaction(() => {
      // Generate Order Number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const currentYear = new Date().getFullYear();
      const orderNumber = `WL-${currentYear}-${randomSuffix}`;

      const res = db.execute(
        `INSERT INTO orders (
          order_number, customer_id, bakery_id, total_amount, subtotal, delivery_fee, tax_amount,
          status, customer_name, customer_phone, delivery_address, delivery_date, delivery_time_slot,
          special_instructions, payment_method, payment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
        [
          orderNumber,
          data.customerId,
          data.bakeryId,
          data.totalAmount,
          data.subtotal,
          data.deliveryFee,
          data.taxAmount,
          data.customerName,
          data.customerPhone,
          data.deliveryAddress,
          data.deliveryDate,
          data.deliveryTimeSlot || null,
          data.specialInstructions || null,
          data.paymentMethod,
        ]
      );

      const orderId = res.lastInsertRowid;

      // Insert line items
      for (const item of data.items) {
        db.execute(
          `INSERT INTO order_items (
            order_id, cake_id, cake_name, cake_image, base_price, quantity, subtotal,
            is_custom, custom_message, selected_options
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            orderId,
            item.cakeId || null,
            item.cakeName,
            item.cakeImage || null,
            item.basePrice,
            item.quantity,
            item.subtotal,
            item.isCustom ? 1 : 0,
            item.customMessage || null,
            item.selectedOptions ? JSON.stringify(item.selectedOptions) : null,
          ]
        );
      }

      return this.findById(orderId)!;
    });
  }

  public updateStatus(
    orderId: number,
    status: OrderStatus,
    rejectionReason?: string | null,
    paymentStatus?: PaymentStatus
  ): Order | null {
    const updates: string[] = ['status = ?'];
    const params: any[] = [status];

    if (rejectionReason !== undefined) {
      updates.push('rejection_reason = ?');
      params.push(rejectionReason);
    }

    if (paymentStatus !== undefined) {
      updates.push('payment_status = ?');
      params.push(paymentStatus);
    } else if (status === 'DELIVERED') {
      updates.push("payment_status = 'PAID'");
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(orderId);

    db.execute(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, params);
    return this.findById(orderId);
  }

  public findByCustomer(
    customerId: number,
    params: { status?: OrderStatus; page?: number; limit?: number }
  ) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.customer_id = ?';
    const queryParams: any[] = [customerId];

    if (params.status) {
      whereClause += ' AND o.status = ?';
      queryParams.push(params.status);
    }

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const orders = db.query<Order>(
      `SELECT o.*, b.name as bakery_name, b.phone as bakery_phone, b.address as bakery_address
       FROM orders o
       JOIN bakeries b ON o.bakery_id = b.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    for (const ord of orders) {
      ord.items = this.getOrderItems(ord.id);
    }

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  public findByBakery(
    bakeryId: number,
    params: { status?: OrderStatus; page?: number; limit?: number }
  ) {
    const page = params.page || 1;
    const limit = params.limit || 15;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE o.bakery_id = ?';
    const queryParams: any[] = [bakeryId];

    if (params.status) {
      whereClause += ' AND o.status = ?';
      queryParams.push(params.status);
    }

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM orders o ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const orders = db.query<Order>(
      `SELECT o.*, u.email as customer_email
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       ${whereClause}
       ORDER BY 
         CASE 
           WHEN o.status = 'PENDING' THEN 1
           WHEN o.status = 'ACCEPTED' THEN 2
           WHEN o.status = 'PREPARING' THEN 3
           WHEN o.status = 'READY' THEN 4
           WHEN o.status = 'OUT_FOR_DELIVERY' THEN 5
           ELSE 6
         END ASC,
         o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    for (const ord of orders) {
      ord.items = this.getOrderItems(ord.id);
    }

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  public getBakeryDashboardStats(bakeryId: number) {
    const pending = db.queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM orders WHERE bakery_id = ? AND status = 'PENDING'",
      [bakeryId]
    )?.count || 0;

    const active = db.queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM orders WHERE bakery_id = ? AND status IN ('ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY')",
      [bakeryId]
    )?.count || 0;

    const completed = db.queryOne<{ count: number }>(
      "SELECT COUNT(*) as count FROM orders WHERE bakery_id = ? AND status = 'DELIVERED'",
      [bakeryId]
    )?.count || 0;

    const revenue = db.queryOne<{ total: number }>(
      "SELECT SUM(total_amount) as total FROM orders WHERE bakery_id = ? AND status = 'DELIVERED'",
      [bakeryId]
    )?.total || 0;

    const recentPending = this.findByBakery(bakeryId, { status: 'PENDING', limit: 5 });

    return {
      pendingOrders: pending,
      activeOrders: active,
      completedOrders: completed,
      totalRevenue: Math.round(revenue * 100) / 100,
      urgentOrders: recentPending.orders,
    };
  }

  public findAllForAdmin(params: {
    status?: OrderStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];

    if (params.status) {
      whereClause += ' AND o.status = ?';
      queryParams.push(params.status);
    }

    if (params.search) {
      whereClause += ' AND (o.order_number LIKE ? OR LOWER(o.customer_name) LIKE ? OR LOWER(b.name) LIKE ?)';
      const term = `%${params.search.toLowerCase()}%`;
      queryParams.push(term, term, term);
    }

    const countRes = db.queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM orders o JOIN bakeries b ON o.bakery_id = b.id ${whereClause}`,
      queryParams
    );
    const total = countRes?.total || 0;

    const orders = db.query<Order>(
      `SELECT o.*, u.email as customer_email, b.name as bakery_name
       FROM orders o
       JOIN users u ON o.customer_id = u.id
       JOIN bakeries b ON o.bakery_id = b.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );

    for (const ord of orders) {
      ord.items = this.getOrderItems(ord.id);
    }

    return {
      orders,
      total,
      page,
      limit,
    };
  }
}

export const orderRepository = new OrderRepository();
