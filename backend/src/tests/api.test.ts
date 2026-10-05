import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { seedDatabase } from '../database/seed.js';
import { db } from '../database/db.js';
import http from 'http';

let app: any;
let server: http.Server;
let baseUrl = '';

async function makeRequest(path: string, options: { method?: string; body?: any; token?: string } = {}) {
  const url = `${baseUrl}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  return { status: res.status, data };
}

beforeAll(async () => {
  await seedDatabase();
  app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        baseUrl = `http://localhost:${addr.port}`;
      }
      resolve();
    });
  });
});

describe('Whisk & Layers Backend Functional & Security Test Suite', () => {
  let customerToken = '';
  let customerId = 0;
  let bakeryToken = '';
  let bakeryId = 0;
  let adminToken = '';

  it('1. GET /api/health should return 200 and healthy database status', async () => {
    const res = await makeRequest('/api/health');
    expect(res.status).toBe(200);
    expect(res.data.status).toBe('pass');
    expect(res.data.database).toBe('healthy');
  });

  it('2. Customer Login with valid credentials should return token and safe user payload', async () => {
    const res = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'customer@whiskandlayers.com',
        password: 'Customer123!',
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.token).toBeDefined();
    expect(res.data.data.user.role).toBe('CUSTOMER');
    expect(res.data.data.user.password_hash).toBeUndefined(); // Security: never leak password hash

    customerToken = res.data.data.token;
    customerId = res.data.data.user.id;
  });

  it('3. Bakery Owner Login should return bakery association', async () => {
    const res = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'sweetcrust@whiskandlayers.com',
        password: 'Bakery123!',
      },
    });

    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.user.role).toBe('BAKERY');
    expect(res.data.data.bakeryId).toBeGreaterThan(0);

    bakeryToken = res.data.data.token;
    bakeryId = res.data.data.bakeryId;
  });

  it('4. Admin Login should succeed and access admin metrics', async () => {
    const loginRes = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@whiskandlayers.com',
        password: 'Admin123!',
      },
    });

    expect(loginRes.status).toBe(200);
    adminToken = loginRes.data.data.token;

    const metricsRes = await makeRequest('/api/admin/metrics', { token: adminToken });
    expect(metricsRes.status).toBe(200);
    expect(metricsRes.data.data.totalBakeries).toBeGreaterThanOrEqual(3);
  });

  it('5. Role Security: Customer cannot access Bakery Dashboard or Admin routes', async () => {
    const bakeryDashRes = await makeRequest('/api/orders/bakery/dashboard', { token: customerToken });
    expect(bakeryDashRes.status).toBe(403);

    const adminMetricsRes = await makeRequest('/api/admin/metrics', { token: customerToken });
    expect(adminMetricsRes.status).toBe(403);
  });

  it('6. Public Discovery: Bakeries, Cakes, Categories & Custom Options', async () => {
    const bakeriesRes = await makeRequest('/api/bakeries');
    expect(bakeriesRes.status).toBe(200);
    expect(bakeriesRes.data.data.bakeries.length).toBeGreaterThanOrEqual(3);

    const cakesRes = await makeRequest('/api/cakes');
    expect(cakesRes.status).toBe(200);
    expect(cakesRes.data.data.cakes.length).toBeGreaterThan(0);

    const customRes = await makeRequest('/api/customizations/options');
    expect(customRes.status).toBe(200);
    expect(customRes.data.data.grouped.BASE.length).toBeGreaterThan(0);
    expect(customRes.data.data.grouped.FLAVOR.length).toBeGreaterThan(0);
    expect(customRes.data.data.grouped.SIZE.length).toBeGreaterThan(0);
  });

  it('7. Order Lifecycle: Customer places custom cake order, Bakery processes to delivery', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deliveryDateStr = futureDate.toISOString().split('T')[0];

    // Customer places order
    const createOrderRes = await makeRequest('/api/orders', {
      method: 'POST',
      token: customerToken,
      body: {
        bakeryId: 1,
        customerName: 'Elena Vance',
        customerPhone: '+1 (555) 234-5678',
        deliveryAddress: '742 Evergreen Terrace, San Francisco, CA',
        deliveryDate: deliveryDateStr,
        deliveryTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
        specialInstructions: 'Handle with care',
        items: [
          {
            cakeId: 1,
            cakeName: 'Raspberry Pistachio Velvet Cake',
            basePrice: 68.0,
            quantity: 1,
            subtotal: 68.0,
            isCustom: false,
          },
        ],
      },
    });

    expect(createOrderRes.status).toBe(201);
    const newOrder = createOrderRes.data.data;
    expect(newOrder.status).toBe('PENDING');
    const orderId = newOrder.id;

    // Bakery accepts order
    const acceptRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: { status: 'ACCEPTED' },
    });
    expect(acceptRes.status).toBe(200);
    expect(acceptRes.data.data.status).toBe('ACCEPTED');

    // Bakery marks preparing
    const prepRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: { status: 'PREPARING' },
    });
    expect(prepRes.status).toBe(200);
    expect(prepRes.data.data.status).toBe('PREPARING');

    // Bakery marks ready
    const readyRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: { status: 'READY' },
    });
    expect(readyRes.status).toBe(200);
    expect(readyRes.data.data.status).toBe('READY');

    // Bakery marks delivered
    const delivRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: { status: 'DELIVERED' },
    });
    expect(delivRes.status).toBe(200);
    expect(delivRes.data.data.status).toBe('DELIVERED');

    // Customer submits verified review for delivered order
    const reviewRes = await makeRequest('/api/reviews', {
      method: 'POST',
      token: customerToken,
      body: {
        orderId,
        rating: 5,
        comment: 'Absolutely spectacular cake! Delivered on time and tasted incredible.',
      },
    });
    expect(reviewRes.status).toBe(201);
    expect(reviewRes.data.data.rating).toBe(5);
  });

  it('8. Rejection Flow: Requires mandatory detailed rejection reason', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deliveryDateStr = futureDate.toISOString().split('T')[0];

    const orderRes = await makeRequest('/api/orders', {
      method: 'POST',
      token: customerToken,
      body: {
        bakeryId: 1,
        customerName: 'Elena Vance',
        customerPhone: '+1 (555) 234-5678',
        deliveryAddress: '742 Evergreen Terrace, San Francisco, CA',
        deliveryDate: deliveryDateStr,
        items: [
          {
            cakeName: 'Custom Tower',
            basePrice: 100.0,
            quantity: 1,
            subtotal: 100.0,
          },
        ],
      },
    });
    const orderId = orderRes.data.data.id;

    // Attempt rejection without reason -> must fail validation
    const failRejectRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: { status: 'REJECTED' },
    });
    expect(failRejectRes.status).toBe(422);

    // Rejection with valid reason
    const validRejectRes = await makeRequest(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      token: bakeryToken,
      body: {
        status: 'REJECTED',
        rejectionReason: 'Fully booked on this date due to wedding catering.',
      },
    });
    expect(validRejectRes.status).toBe(200);
    expect(validRejectRes.data.data.status).toBe('REJECTED');
    expect(validRejectRes.data.data.rejection_reason).toContain('Fully booked');
  });
});
