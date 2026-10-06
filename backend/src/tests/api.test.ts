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
  await seedDatabase(true);
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

describe('Whisk & Layers India-First Backend Test Suite', () => {
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
    expect(res.data.data.user.full_name).toBe('Aditya Nair');
    expect(res.data.data.user.phone).toBe('+91 9876543210');
    expect(res.data.data.user.password_hash).toBeUndefined();

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
    const bakeryNames = bakeriesRes.data.data.bakeries.map((b: any) => b.name);
    expect(bakeryNames).toContain('Whisk House');

    const cakesRes = await makeRequest('/api/cakes');
    expect(cakesRes.status).toBe(200);
    expect(cakesRes.data.data.cakes.length).toBeGreaterThan(0);

    const customRes = await makeRequest('/api/customizations/options');
    expect(customRes.status).toBe(200);
    expect(customRes.data.data.grouped.BASE.length).toBeGreaterThan(0);
    expect(customRes.data.data.grouped.FLAVOR.length).toBeGreaterThan(0);
    expect(customRes.data.data.grouped.SIZE.length).toBeGreaterThan(0);
    // Verify weights in Kg
    const sizeLabels = customRes.data.data.grouped.SIZE.map((s: any) => s.label);
    expect(sizeLabels.some((l: string) => l.includes('Kg'))).toBe(true);
  });

  it('7. Order Lifecycle: Customer places order, Bakery processes to delivery', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const deliveryDateStr = futureDate.toISOString().split('T')[0];

    // Customer places order with Indian mobile number and PIN code address
    const createOrderRes = await makeRequest('/api/orders', {
      method: 'POST',
      token: customerToken,
      body: {
        bakeryId: bakeryId,
        customerName: 'Aditya Nair',
        customerPhone: '+91 9876543210',
        deliveryAddress: 'Flat 402, Shree Residency, 150 Feet Ring Road, Near Nana Mava Circle, Rajkot, Gujarat 360005',
        deliveryDate: deliveryDateStr,
        deliveryTimeSlot: 'Morning (09:00 AM - 12:00 PM)',
        specialInstructions: 'Handle with care, anniversary cake',
        items: [
          {
            cakeId: 1,
            cakeName: 'Dutch Chocolate Truffle Cake (100% Eggless)',
            basePrice: 750.0,
            quantity: 1,
            subtotal: 750.0,
            isCustom: false,
          },
        ],
      },
    });

    expect(createOrderRes.status).toBe(201);
    const newOrder = createOrderRes.data.data;
    expect(newOrder.status).toBe('PENDING');
    expect(newOrder.total_amount).toBeGreaterThan(750.0);
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
        comment: 'Superb Dutch Chocolate Truffle cake! Arrived fresh and beautifully decorated.',
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
        bakeryId: bakeryId,
        customerName: 'Aditya Nair',
        customerPhone: '+91 9876543210',
        deliveryAddress: 'Flat 402, Shree Residency, 150 Feet Ring Road, Rajkot, Gujarat 360005',
        deliveryDate: deliveryDateStr,
        items: [
          {
            cakeName: 'Custom Celebration Tier',
            basePrice: 1500.0,
            quantity: 1,
            subtotal: 1500.0,
          },
        ],
      },
    });
    const orderId = orderRes.data.data.id;

    // Attempt rejection without reason -> must fail validation (422)
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
        rejectionReason: 'Fully booked on this date due to wedding catering in Ahmedabad.',
      },
    });
    expect(validRejectRes.status).toBe(200);
    expect(validRejectRes.data.data.status).toBe('REJECTED');
    expect(validRejectRes.data.data.rejection_reason).toContain('wedding catering');
  });

  it('9. India-First Phone & PIN Code Validation', async () => {
    // 9a. Registration with valid Indian 10-digit phone
    const validReg = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        email: `karan.${Date.now()}@example.com`,
        password: 'Password123!',
        fullName: 'Karan Mehta',
        phone: '9876543210',
        role: 'CUSTOMER',
      },
    });
    expect(validReg.status).toBe(201);

    // 9b. Registration with invalid phone (e.g. US 555 number) must fail
    const invalidPhoneReg = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        email: `invalid.${Date.now()}@example.com`,
        password: 'Password123!',
        fullName: 'Invalid User',
        phone: '555-123-4567',
        role: 'CUSTOMER',
      },
    });
    expect(invalidPhoneReg.status).toBe(422);

    // 9c. Bakery registration with invalid PIN code must fail
    const invalidPinBakery = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: {
        email: `bakery.${Date.now()}@example.com`,
        password: 'Password123!',
        fullName: 'Baker Test',
        role: 'BAKERY',
        bakeryName: 'Test Bakery',
        postalCode: '12', // Invalid PIN code
        phone: '9825123456',
      },
    });
    expect(invalidPinBakery.status).toBe(422);
  });
});
