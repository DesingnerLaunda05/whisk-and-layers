import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderApi } from '../../services/orderApi';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useToast } from '../../context/ToastContext';
import {
  Package,
  Calendar,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  ChefHat,
  Sparkles,
  Truck,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { formatINR, formatIndianDate } from '../../utils/indiaConstants';

export const BakeryOrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedOrderId = searchParams.get('orderId') ? parseInt(searchParams.get('orderId')!, 10) : null;

  const { success, error } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');

  // Rejection Modal State
  const [rejectModalOrder, setRejectModalOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);

  // Selected Order for Details Inspector Modal
  const [inspectorOrder, setInspectorOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getBakeryOrders();
      setOrders(res.orders);

      if (highlightedOrderId) {
        const match = res.orders.find((o) => o.id === highlightedOrderId);
        if (match) setInspectorOrder(match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus, reason?: string) => {
    setUpdating(true);
    try {
      const updated = await orderApi.updateStatus(orderId, newStatus, reason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, rejection_reason: reason || null } : o)));
      if (inspectorOrder && inspectorOrder.id === orderId) {
        setInspectorOrder({ ...inspectorOrder, status: newStatus, rejection_reason: reason || null });
      }
      setRejectModalOrder(null);
      setRejectionReason('');
      success(`Order updated to status: ${newStatus}`);
    } catch (err: any) {
      error(err.message || 'Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return o.status === 'PENDING';
    if (activeTab === 'IN_PRODUCTION') return ['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(o.status);
    if (activeTab === 'DELIVERED') return o.status === 'DELIVERED';
    if (activeTab === 'REJECTED') return o.status === 'REJECTED';
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Bakery Order Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Accept incoming orders, coordinate custom recipe details, and update preparation stages.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '1.75rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'ALL', label: `All Orders (${orders.length})` },
          { id: 'PENDING', label: `Pending Approval (${orders.filter((o) => o.status === 'PENDING').length})` },
          { id: 'IN_PRODUCTION', label: 'In Production' },
          { id: 'DELIVERED', label: 'Completed' },
          { id: 'REJECTED', label: 'Declined' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.1rem',
              fontSize: '0.88rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table / Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} height="130px" borderRadius="14px" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="No Orders in this Section"
          description="There are currently no orders under this status tab."
          icon="cake"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="card"
              style={{
                padding: '1.5rem',
                border: highlightedOrderId === order.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>
                    #{order.order_number}
                  </span>
                  <StatusBadge status={order.status} size="sm" />
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)', fontFamily: 'var(--font-serif)' }}>
                    {formatINR(order.total_amount)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '0.5rem' }}>
                    ({order.payment_method})
                  </span>
                </div>
              </div>

              {/* Order Info Body */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr',
                  gap: '1.25rem',
                  padding: '1rem 0',
                }}
                className="order-row-columns"
              >
                {/* Customer */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Customer</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{order.customer_name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{order.customer_phone}</div>
                </div>

                {/* Delivery */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Scheduled Delivery</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{formatIndianDate(order.delivery_date)}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.delivery_time_slot || 'Standard'}</div>
                </div>

                {/* Cake Summary */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Items</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                    {order.items?.map((it) => `${it.quantity}x ${it.cake_name}`).join(', ')}
                  </div>
                  {order.items?.some((i) => i.custom_message) && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>Has custom inscription</div>
                  )}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <button
                  onClick={() => setInspectorOrder(order)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Eye size={14} />
                  <span>Inspect Full Details</span>
                </button>

                {/* Workflow Transitions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => setRejectModalOrder(order)}
                        disabled={updating}
                        className="btn btn-danger btn-sm"
                      >
                        Decline Order
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ACCEPTED')}
                        disabled={updating}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Accept & Schedule</span>
                      </button>
                    </>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={updating}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <ChefHat size={14} />
                      <span>Start Baking (Preparing)</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      disabled={updating}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Sparkles size={14} />
                      <span>Mark Boxed & Ready</span>
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                      disabled={updating}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Truck size={14} />
                      <span>Dispatch (Out for Delivery)</span>
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                      disabled={updating}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#2C5E43', borderColor: '#2C5E43' }}
                    >
                      Confirm Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)', marginBottom: '0.5rem' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: 0 }}>
                Decline Order #{rejectModalOrder.order_number}
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Please provide a detailed reason so the customer understands why the order could not be accepted.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!rejectionReason.trim() || rejectionReason.trim().length < 5) {
                  error('Rejection reason must be at least 5 characters long.');
                  return;
                }
                handleUpdateStatus(rejectModalOrder.id, 'REJECTED', rejectionReason.trim());
              }}
            >
              <div className="form-group">
                <label className="form-label">Decline Reason *</label>
                <textarea
                  required
                  rows={3}
                  className="form-control"
                  placeholder="e.g. Kitchen fully booked with 3 wedding cakes for this weekend; ingredient unavailable."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalOrder(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn btn-danger"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Inspector Modal */}
      {inspectorOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
                  Order #{inspectorOrder.order_number} Details
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(inspectorOrder.created_at).toLocaleString()}
                </span>
              </div>
              <StatusBadge status={inspectorOrder.status} />
            </div>

            {/* Customer & Address Details */}
            <div style={{ backgroundColor: 'var(--bg-muted)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div><strong>Customer:</strong> {inspectorOrder.customer_name} ({inspectorOrder.customer_phone})</div>
              <div style={{ marginTop: '0.25rem' }}><strong>Delivery:</strong> {inspectorOrder.delivery_address}</div>
              <div style={{ marginTop: '0.25rem' }}><strong>Scheduled Date:</strong> {inspectorOrder.delivery_date} ({inspectorOrder.delivery_time_slot})</div>
              {inspectorOrder.special_instructions && (
                <div style={{ marginTop: '0.25rem', color: 'var(--primary)' }}>
                  <strong>Instructions:</strong> {inspectorOrder.special_instructions}
                </div>
              )}
            </div>

            {/* Cake Line Items with Custom Choices */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Recipe & Customization Breakdown:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {inspectorOrder.items?.map((it) => {
                  let parsedOptions: Record<string, string> | null = null;
                  if (it.selected_options) {
                    try {
                      parsedOptions = typeof it.selected_options === 'string' ? JSON.parse(it.selected_options) : it.selected_options;
                    } catch {}
                  }

                  return (
                    <div key={it.id} style={{ border: '1px solid var(--border-medium)', borderRadius: '10px', padding: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text-main)' }}>
                        <span>{it.quantity}x {it.cake_name}</span>
                        <span>{formatINR(it.subtotal)}</span>
                      </div>

                      {parsedOptions && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {Object.entries(parsedOptions).map(([k, v]) => (
                            <div key={k}><strong>{k}:</strong> {String(v)}</div>
                          ))}
                        </div>
                      )}

                      {it.custom_message && (
                        <div style={{ marginTop: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                          Piped Inscription: "{it.custom_message}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>
                Total: {formatINR(inspectorOrder.total_amount)}
              </span>

              <button
                onClick={() => setInspectorOrder(null)}
                className="btn btn-primary btn-sm"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .order-row-columns {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};
