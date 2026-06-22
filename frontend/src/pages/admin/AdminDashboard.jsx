import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { adminService } from '../../services/bookstoreService';
import { Spinner } from '../../components/common';
import AdminLayout from './AdminLayout';

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Spinner size="lg" /></div></AdminLayout>;

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500', change: '+12% this month' },
    { title: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'bg-violet-500', change: `${stats.outOfStockBooks} out of stock` },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-amber-500', change: `${stats.pendingOrders} pending` },
    { title: 'Total Revenue', value: `$${parseFloat(stats.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-green-500', change: `${stats.deliveredOrders} delivered` },
  ];

  const revenueData = Object.entries(stats.revenueByMonth || {})
    .map(([month, val]) => ({ month: month.replace('Month-', 'M'), revenue: parseFloat(val) }))
    .sort((a, b) => parseInt(a.month.slice(1)) - parseInt(b.month.slice(1)));

  const categoryData = Object.entries(stats.booksByCategory || {})
    .map(([name, value]) => ({ name, value: Number(value) }));

  const orderStatusData = Object.entries(stats.ordersByStatus || {})
    .map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
          </div>
          <div className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(({ title, value, icon: Icon, color, change }) => (
            <div key={title} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
              <p className="text-xs text-green-600 mt-1">{change}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 card p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" /> Monthly Revenue
            </h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={(v) => [`$${v.toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">No revenue data yet</div>
            )}
          </div>

          {/* Order Status Pie */}
          <div className="card p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Order Status</h3>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                    {orderStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(v) => <span className="text-xs">{v}</span>} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">No order data</div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Books by Category */}
          <div className="card p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Books by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-gray-400">No category data</div>
            )}
          </div>

          {/* Quick Actions & Alerts */}
          <div className="card p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                ['/admin/books/new', '➕', 'Add Book', 'bg-blue-50 text-blue-700 dark:bg-blue-900/20'],
                ['/admin/orders', '📦', 'View Orders', 'bg-amber-50 text-amber-700 dark:bg-amber-900/20'],
                ['/admin/users', '👥', 'Manage Users', 'bg-green-50 text-green-700 dark:bg-green-900/20'],
                ['/admin/books', '📚', 'All Books', 'bg-violet-50 text-violet-700 dark:bg-violet-900/20'],
              ].map(([to, icon, label, cls]) => (
                <Link key={label} to={to} className={`${cls} rounded-xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}>
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-semibold">{label}</span>
                </Link>
              ))}
            </div>
            {stats.outOfStockBooks > 0 && (
              <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">{stats.outOfStockBooks} books out of stock</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">Update inventory to continue selling</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
