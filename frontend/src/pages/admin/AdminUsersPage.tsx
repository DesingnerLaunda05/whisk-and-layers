import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { User } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { SafeImage } from '../../components/ui/SafeImage';
import { useToast } from '../../context/ToastContext';
import { Users, CheckCircle2, XCircle, Search } from 'lucide-react';
import { formatIndianDate } from '../../utils/indiaConstants';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const { success, error } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({
        search: search.trim() || undefined,
        role: roleFilter || undefined,
      });
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleStatus = async (u: User) => {
    try {
      const nextState = !u.is_active;
      await adminApi.toggleUserStatus(u.id, nextState);
      setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, is_active: nextState } : item)));
      success(`User "${u.full_name}" ${nextState ? 'activated' : 'deactivated'}.`);
    } catch (err: any) {
      error(err.message || 'Failed to update user status.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--text-main)' }}>Platform Users</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Inspect registered customer, bakery merchant, and administrator accounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-control"
            style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="BAKERY">Bakery Owner</option>
            <option value="ADMIN">Admin</option>
          </select>

          <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="Search user name or email..."
              className="form-control"
              style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              Search
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => <Skeleton key={n} height="70px" borderRadius="12px" />)}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>User</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Phone</th>
                  <th style={{ padding: '1rem' }}>Registered</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <SafeImage
                          src={u.avatar_url}
                          alt={u.full_name}
                          fallbackType="avatar"
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.full_name}</span>
                      </div>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ backgroundColor: u.role === 'ADMIN' ? '#FAF5FF' : u.role === 'BAKERY' ? 'var(--primary-light)' : 'var(--bg-muted)', color: u.role === 'ADMIN' ? '#7E22CE' : u.role === 'BAKERY' ? 'var(--primary)' : 'var(--text-main)' }}>
                        {u.role}
                      </span>
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                      {u.phone || '—'}
                    </td>

                    <td style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {formatIndianDate(u.created_at)}
                    </td>

                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', color: u.is_active ? '#2C5E43' : '#B92525' }}>
                        {u.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`btn btn-sm ${u.is_active ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          {u.is_active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
