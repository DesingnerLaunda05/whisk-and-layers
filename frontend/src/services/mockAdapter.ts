import { MockDataStore } from './mockDataStore';
import { Bakery, Cake, Order, User } from '../types';

export function handleMockFallback<T>(endpoint: string, options: { method?: string; body?: any }): T {
  const method = (options.method || 'GET').toUpperCase();
  const url = new URL(`http://dummy${endpoint}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // 1. Auth Endpoints
  if (pathname === '/auth/login' && method === 'POST') {
    const { email } = options.body || {};
    const users = MockDataStore.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
    const bakeries = MockDataStore.getBakeries();
    const bakery = bakeries.find((b) => b.user_id === user.id) || null;

    localStorage.setItem('wl_token', `demo_token_${user.id}`);
    localStorage.setItem('wl_active_user_id', String(user.id));

    return {
      user,
      token: `demo_jwt_token_${user.id}`,
      bakeryId: bakery ? bakery.id : null,
    } as unknown as T;
  }

  if (pathname === '/auth/register' && method === 'POST') {
    const { email, fullName, role = 'CUSTOMER', phone } = options.body || {};
    const users = MockDataStore.getUsers();
    const newUser: User = {
      id: users.length + 1,
      email: email || 'demo@whiskandlayers.com',
      full_name: fullName || 'Demo User',
      phone: phone || null,
      role: role as any,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);

    localStorage.setItem('wl_token', `demo_token_${newUser.id}`);
    localStorage.setItem('wl_active_user_id', String(newUser.id));

    return {
      user: newUser,
      token: `demo_jwt_token_${newUser.id}`,
      bakeryId: null,
    } as unknown as T;
  }

  if (pathname === '/auth/me' && method === 'GET') {
    const users = MockDataStore.getUsers();
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const user = users.find((u) => u.id === activeId) || users[0];
    const bakeries = MockDataStore.getBakeries();
    const bakery = bakeries.find((b) => b.user_id === user.id) || null;

    return {
      user,
      bakery,
    } as unknown as T;
  }

  if (pathname === '/auth/profile' && method === 'PUT') {
    const users = MockDataStore.getUsers();
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const user = users.find((u) => u.id === activeId) || users[0];
    if (options.body.fullName) user.full_name = options.body.fullName;
    if (options.body.phone !== undefined) user.phone = options.body.phone;
    if (options.body.avatarUrl) user.avatar_url = options.body.avatarUrl;
    return user as unknown as T;
  }

  // 2. Bakeries
  if (pathname === '/bakeries' && method === 'GET') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const city = (searchParams.get('city') || '').toLowerCase();
    let list = MockDataStore.getBakeries().filter((b) => b.is_active && b.is_approved);

    if (search) {
      list = list.filter((b) => b.name.toLowerCase().includes(search) || (b.specialties || '').toLowerCase().includes(search));
    }
    if (city) {
      list = list.filter((b) => b.city.toLowerCase() === city);
    }

    return {
      bakeries: list,
      total: list.length,
      page: 1,
      limit: 20,
    } as unknown as T;
  }

  if (pathname.startsWith('/bakeries/') && method === 'GET') {
    const idOrSlug = pathname.replace('/bakeries/', '');
    if (idOrSlug === 'my-bakery') {
      const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '3', 10);
      const bakery = MockDataStore.getBakeries().find((b) => b.user_id === activeId) || MockDataStore.getBakeries()[0];
      return bakery as unknown as T;
    }

    const bakery = MockDataStore.getBakeries().find(
      (b) => String(b.id) === idOrSlug || b.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!bakery) throw new Error('Bakery not found');

    const cakes = MockDataStore.getCakes().filter((c) => c.bakery_id === bakery.id);
    const reviews = MockDataStore.getReviews().filter((r) => r.bakery_id === bakery.id);

    return {
      bakery,
      cakes,
      reviews,
    } as unknown as T;
  }

  if (pathname === '/bakeries/my-bakery' && method === 'PUT') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '3', 10);
    const bakery = MockDataStore.getBakeries().find((b) => b.user_id === activeId) || MockDataStore.getBakeries()[0];
    Object.assign(bakery, options.body);
    return bakery as unknown as T;
  }

  // 3. Cakes
  if (pathname === '/cakes/categories' && method === 'GET') {
    return MockDataStore.getCategories() as unknown as T;
  }

  if (pathname === '/cakes' && method === 'GET') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const categoryId = searchParams.get('category');
    const customizable = searchParams.get('customizable');
    let list = MockDataStore.getCakes().filter((c) => c.is_available && c.is_active);

    if (search) {
      list = list.filter((c) => c.name.toLowerCase().includes(search) || c.description.toLowerCase().includes(search));
    }
    if (categoryId) {
      list = list.filter((c) => String(c.category_id) === categoryId);
    }
    if (customizable === 'true') {
      list = list.filter((c) => c.is_customizable === 1);
    }

    return {
      cakes: list,
      total: list.length,
      page: 1,
      limit: 20,
    } as unknown as T;
  }

  if (pathname.startsWith('/cakes/') && method === 'GET') {
    const idOrSlug = pathname.replace('/cakes/', '');
    const cake = MockDataStore.getCakes().find(
      (c) => String(c.id) === idOrSlug || c.slug.toLowerCase() === idOrSlug.toLowerCase()
    );
    if (!cake) throw new Error('Cake not found');
    return cake as unknown as T;
  }

  if (pathname === '/cakes' && method === 'POST') {
    const cakes = MockDataStore.getCakes();
    const newCake: Cake = {
      id: cakes.length + 1,
      bakery_id: 1,
      category_id: options.body.category_id || 1,
      name: options.body.name || 'New Cake',
      slug: (options.body.name || 'new-cake').toLowerCase().replace(/\s+/g, '-'),
      description: options.body.description || '',
      base_price: parseFloat(options.body.base_price) || 50,
      preparation_days: parseInt(options.body.preparation_days, 10) || 2,
      image_url: options.body.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      gallery_urls: null,
      is_customizable: options.body.is_customizable ? 1 : 0,
      is_available: options.body.is_available ? 1 : 0,
      is_active: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    cakes.unshift(newCake);
    return newCake as unknown as T;
  }

  if (pathname.startsWith('/cakes/') && method === 'PUT') {
    const id = parseInt(pathname.replace('/cakes/', ''), 10);
    const cake = MockDataStore.getCakes().find((c) => c.id === id);
    if (!cake) throw new Error('Cake not found');
    Object.assign(cake, options.body);
    return cake as unknown as T;
  }

  if (pathname.startsWith('/cakes/') && method === 'DELETE') {
    const id = parseInt(pathname.replace('/cakes/', ''), 10);
    const cake = MockDataStore.getCakes().find((c) => c.id === id);
    if (cake) cake.is_active = 0;
    return null as unknown as T;
  }

  // 4. Customizations
  if (pathname === '/customizations/options' && method === 'GET') {
    const optionsList = MockDataStore.getOptions();
    const grouped = optionsList.reduce((acc: any, opt) => {
      if (!acc[opt.type]) acc[opt.type] = [];
      acc[opt.type].push(opt);
      return acc;
    }, {});
    return grouped as unknown as T;
  }

  // 5. Orders
  if (pathname === '/orders' && method === 'POST') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const order = MockDataStore.saveOrder(options.body, activeId);
    return order as unknown as T;
  }

  if (pathname.startsWith('/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
    const id = parseInt(pathname.split('/')[2], 10);
    const { status, rejectionReason } = options.body || {};
    const updated = MockDataStore.updateOrderStatus(id, status, rejectionReason);
    return updated as unknown as T;
  }

  if (pathname === '/orders/my-orders' && method === 'GET') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const orders = MockDataStore.getOrders().filter((o) => o.customer_id === activeId);
    return {
      orders,
      total: orders.length,
      page: 1,
      limit: 10,
    } as unknown as T;
  }

  if (pathname === '/orders/bakery/orders' && method === 'GET') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '3', 10);
    const bakery = MockDataStore.getBakeries().find((b) => b.user_id === activeId) || MockDataStore.getBakeries()[0];
    const orders = MockDataStore.getOrders().filter((o) => o.bakery_id === bakery.id);
    return {
      orders,
      total: orders.length,
      page: 1,
      limit: 15,
    } as unknown as T;
  }

  if (pathname === '/orders/bakery/dashboard' && method === 'GET') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '3', 10);
    const bakery = MockDataStore.getBakeries().find((b) => b.user_id === activeId) || MockDataStore.getBakeries()[0];
    const orders = MockDataStore.getOrders().filter((o) => o.bakery_id === bakery.id);

    return {
      pendingOrders: orders.filter((o) => o.status === 'PENDING').length,
      activeOrders: orders.filter((o) => ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status)).length,
      completedOrders: orders.filter((o) => o.status === 'DELIVERED').length,
      totalRevenue: orders
        .filter((o) => o.status === 'DELIVERED')
        .reduce((sum, o) => sum + (o.total_amount || 0), 0),
      urgentOrders: orders.slice(0, 5),
    } as unknown as T;
  }

  if (pathname.startsWith('/orders/') && method === 'GET') {
    const id = parseInt(pathname.replace('/orders/', ''), 10);
    const order = MockDataStore.getOrders().find((o) => o.id === id);
    if (!order) throw new Error('Order not found');
    const review = MockDataStore.getReviews().find((r) => r.order_id === order.id) || null;
    return { ...order, review } as unknown as T;
  }

  // 6. Reviews
  if (pathname === '/reviews' && method === 'POST') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const rev = MockDataStore.addReview(options.body, activeId);
    return rev as unknown as T;
  }

  if (pathname.endsWith('/reply') && method === 'POST') {
    const id = parseInt(pathname.split('/')[2], 10);
    const rev = MockDataStore.replyReview(id, options.body.replyComment);
    return rev as unknown as T;
  }

  // 7. Notifications
  if (pathname === '/notifications' && method === 'GET') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    const list = MockDataStore.getNotifications().filter((n) => n.user_id === activeId);
    return list as unknown as T;
  }

  if (pathname.startsWith('/notifications/') && pathname.endsWith('/read') && method === 'PATCH') {
    const id = parseInt(pathname.split('/')[2], 10);
    const notif = MockDataStore.getNotifications().find((n) => n.id === id);
    if (notif) notif.is_read = 1;
    return null as unknown as T;
  }

  if (pathname === '/notifications/read-all' && method === 'PATCH') {
    const activeId = parseInt(localStorage.getItem('wl_active_user_id') || '1', 10);
    MockDataStore.getNotifications()
      .filter((n) => n.user_id === activeId)
      .forEach((n) => (n.is_read = 1));
    return null as unknown as T;
  }

  // 8. Admin
  if (pathname === '/admin/metrics' && method === 'GET') {
    const orders = MockDataStore.getOrders();
    const gmv = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return {
      totalUsers: MockDataStore.getUsers().length,
      totalBakeries: MockDataStore.getBakeries().length,
      totalOrders: orders.length,
      totalGmv: gmv,
      pendingBakeries: 0,
      recentOrders: orders.slice(0, 5),
    } as unknown as T;
  }

  if (pathname === '/admin/bakeries' && method === 'GET') {
    return {
      bakeries: MockDataStore.getBakeries(),
      total: MockDataStore.getBakeries().length,
    } as unknown as T;
  }

  if (pathname === '/admin/users' && method === 'GET') {
    return {
      users: MockDataStore.getUsers(),
      total: MockDataStore.getUsers().length,
    } as unknown as T;
  }

  if (pathname === '/admin/orders' && method === 'GET') {
    return {
      orders: MockDataStore.getOrders(),
      total: MockDataStore.getOrders().length,
    } as unknown as T;
  }

  // 9. Upload
  if (pathname === '/upload' && method === 'POST') {
    return {
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
    } as unknown as T;
  }

  throw new Error(`Unhandled mock endpoint: ${method} ${pathname}`);
}
