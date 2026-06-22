import React, { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, UserCheck, UserX, Search } from 'lucide-react';
import { adminService } from '../../services/bookstoreService';
import { Spinner, Badge, Pagination } from '../../components/common';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ page, size: 10 });
      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleToggle = async (id, name) => {
    try {
      const updated = await adminService.toggleUserStatus(id);
      setUsers(prev => prev.map(u => u.id === id ? updated.data : u));
      toast.success(`${name}'s account ${updated.data.enabled ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Failed to update user');
    }
  };

  const filtered = users.filter(u => !search || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCheck className="w-4 h-4 text-green-500" /> {users.filter(u => u.enabled).length} active
            <span className="mx-2">|</span>
            <UserX className="w-4 h-4 text-red-500" /> {users.filter(u => !u.enabled).length} disabled
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-10" />
            </div>
          </div>

          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    {['User', 'Email', 'Role', 'Orders', 'Joined', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === 'ADMIN' ? 'danger' : 'info'}>{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-medium">{user.totalOrders || 0}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.enabled ? 'success' : 'danger'}>{user.enabled ? 'Active' : 'Disabled'}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleToggle(user.id, `${user.firstName} ${user.lastName}`)}
                          disabled={user.role === 'ADMIN'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                            ${user.enabled ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30'}`}>
                          {user.enabled ? <><ToggleRight className="w-3.5 h-3.5" /> Disable</> : <><ToggleLeft className="w-3.5 h-3.5" /> Enable</>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 pb-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
