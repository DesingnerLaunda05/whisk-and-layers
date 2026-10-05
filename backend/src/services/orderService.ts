import { orderRepository } from '../repositories/orderRepository.js';
import { bakeryRepository } from '../repositories/bakeryRepository.js';
import { cakeRepository } from '../repositories/cakeRepository.js';
import { notificationRepository } from '../repositories/notificationRepository.js';
import { OrderStatus, UserRole } from '../types/index.js';

export class OrderService {
  public async createOrder(customerId: number, data: any) {
    const bakery = bakeryRepository.findById(data.bakeryId);
    if (!bakery || bakery.is_active !== 1 || bakery.is_approved !== 1) {
      throw new Error('Selected bakery is currently unavailable.');
    }

    // Verify lead days
    const deliveryDateObj = new Date(data.deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(minDeliveryDate.getDate() + bakery.minimum_lead_days);

    if (deliveryDateObj < minDeliveryDate) {
      throw new Error(
        `This bakery requires at least ${bakery.minimum_lead_days} days lead time for orders. Earliest available date is ${minDeliveryDate.toISOString().split('T')[0]}.`
      );
    }

    // Calculate subtotal with integrity
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of data.items) {
      let itemBasePrice = item.basePrice;

      if (item.cakeId) {
        const cake = cakeRepository.findById(item.cakeId);
        if (cake) {
          itemBasePrice = cake.base_price;
        }
      }

      // If custom choices are present, ensure calculation includes extra options
      let itemTotal = itemBasePrice;
      if (item.selectedOptions && typeof item.selectedOptions === 'object') {
        // sum option prices
        for (const val of Object.values(item.selectedOptions)) {
          if (typeof val === 'string') {
            const match = val.match(/\+\$([\d.]+)/);
            if (match) {
              itemTotal += parseFloat(match[1]);
            }
          }
        }
      }

      const quantity = Math.max(1, item.quantity || 1);
      const lineSubtotal = Math.round(itemTotal * quantity * 100) / 100;
      calculatedSubtotal += lineSubtotal;

      validatedItems.push({
        cakeId: item.cakeId || null,
        cakeName: item.cakeName,
        cakeImage: item.cakeImage || null,
        basePrice: itemBasePrice,
        quantity,
        subtotal: lineSubtotal,
        isCustom: item.isCustom || false,
        customMessage: item.customMessage || null,
        selectedOptions: item.selectedOptions || null,
      });
    }

    calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;
    const deliveryFee = 5.00;
    const taxAmount = Math.round(calculatedSubtotal * 0.0825 * 100) / 100; // 8.25% standard tax
    const totalAmount = Math.round((calculatedSubtotal + deliveryFee + taxAmount) * 100) / 100;

    const order = orderRepository.create({
      customerId,
      bakeryId: bakery.id,
      subtotal: calculatedSubtotal,
      deliveryFee,
      taxAmount,
      totalAmount,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      deliveryDate: data.deliveryDate,
      deliveryTimeSlot: data.deliveryTimeSlot,
      specialInstructions: data.specialInstructions,
      paymentMethod: data.paymentMethod || 'PAY_ON_DELIVERY',
      items: validatedItems,
    });

    // Notify Bakery Owner
    notificationRepository.create({
      userId: bakery.user_id,
      type: 'NEW_ORDER',
      title: 'New Cake Order Received! 🎂',
      message: `${data.customerName} placed order #${order.order_number} ($${order.total_amount.toFixed(2)}).`,
      linkUrl: `/bakery/orders/${order.id}`,
    });

    return order;
  }

  public getOrderById(orderId: number, requestingUserId: number, role: UserRole) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    // Security check: Customer can only view own order, Bakery can only view its orders, Admin can view all
    if (role === 'CUSTOMER' && order.customer_id !== requestingUserId) {
      throw new Error('Access denied. You do not have permission to view this order.');
    }

    if (role === 'BAKERY') {
      const bakery = bakeryRepository.findByUserId(requestingUserId);
      if (!bakery || bakery.id !== order.bakery_id) {
        throw new Error('Access denied. This order belongs to another bakery.');
      }
    }

    return order;
  }

  public getCustomerOrders(customerId: number, params: any) {
    return orderRepository.findByCustomer(customerId, params);
  }

  public getBakeryOrders(userId: number, params: any) {
    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery) {
      throw new Error('Bakery not found for this account.');
    }
    return orderRepository.findByBakery(bakery.id, params);
  }

  public getBakeryDashboard(userId: number) {
    const bakery = bakeryRepository.findByUserId(userId);
    if (!bakery) {
      throw new Error('Bakery not found.');
    }
    return orderRepository.getBakeryDashboardStats(bakery.id);
  }

  public updateStatus(
    orderId: number,
    userId: number,
    role: UserRole,
    newStatus: OrderStatus,
    rejectionReason?: string | null
  ) {
    const order = orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found.');
    }

    if (role === 'BAKERY') {
      const bakery = bakeryRepository.findByUserId(userId);
      if (!bakery || bakery.id !== order.bakery_id) {
        throw new Error('Access denied. You can only update orders for your bakery.');
      }
    }

    // Validate status transition
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY'],
      READY: ['OUT_FOR_DELIVERY', 'DELIVERED'],
      OUT_FOR_DELIVERY: ['DELIVERED'],
      DELIVERED: [],
      REJECTED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(newStatus) && role !== 'ADMIN') {
      throw new Error(`Cannot transition order from status '${order.status}' to '${newStatus}'.`);
    }

    const updated = orderRepository.updateStatus(orderId, newStatus, rejectionReason);

    // Notify customer about status change
    const statusMessages: Record<string, string> = {
      ACCEPTED: `Your order #${order.order_number} has been accepted by ${order.bakery_name}! 👩‍🍳`,
      PREPARING: `The bakery is now baking and decorating your order #${order.order_number}. 🧁`,
      READY: `Your cake is freshly completed and boxed ready for delivery (Order #${order.order_number}). ✨`,
      OUT_FOR_DELIVERY: `Your order #${order.order_number} is out for delivery to your address! 🚚`,
      DELIVERED: `Your order #${order.order_number} has been delivered! Enjoy your cake! 🎉`,
      REJECTED: `Order #${order.order_number} could not be accepted: "${rejectionReason || 'Bakery at maximum capacity'}"`,
    };

    if (statusMessages[newStatus]) {
      notificationRepository.create({
        userId: order.customer_id,
        type: 'ORDER_STATUS',
        title: `Order Update: ${newStatus}`,
        message: statusMessages[newStatus],
        linkUrl: `/orders/${order.id}`,
      });
    }

    return updated;
  }
}

export const orderService = new OrderService();
