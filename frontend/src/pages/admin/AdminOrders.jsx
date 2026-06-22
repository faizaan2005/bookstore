import React, { useState, useEffect } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import { adminService } from '../../services/bookstoreService';
import { Spinner, Badge, Modal, Pagination } from '../../components/common';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'info',
  SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'danger', REFUNDED: 'default'
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders({ page, size: 10 });
      setOrders(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>

        <div className="card overflow-hidden">
          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary-600">#{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{order.user?.firstName} {order.user?.lastName}</p>
                          <p className="text-xs text-gray-400">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{order.items?.length} items</td>
                      <td className="py-3 px-4 font-bold">${parseFloat(order.totalAmount).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}>{order.paymentStatus}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order.id, e.target.value)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer appearance-none pr-6
                              ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
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

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Order #${selectedOrder?.orderNumber}`} size="xl">
        {selectedOrder && (
          <div className="space-y-5">
            {/* Status & Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Status', <Badge key="s" variant={STATUS_COLORS[selectedOrder.status]}>{selectedOrder.status}</Badge>],
                ['Payment', <Badge key="p" variant={selectedOrder.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}>{selectedOrder.paymentStatus}</Badge>],
                ['Total', `$${parseFloat(selectedOrder.totalAmount).toFixed(2)}`],
                ['Date', new Date(selectedOrder.createdAt).toLocaleDateString()],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <div className="font-semibold">{val}</div>
                </div>
              ))}
            </div>

            {/* Customer & Address */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h4>
                <p className="text-sm">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
              </div>
              {selectedOrder.shippingAddress && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                  <p className="text-sm">{selectedOrder.shippingAddress}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.shippingCity}, {selectedOrder.shippingState} {selectedOrder.shippingZip}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <img src={item.book?.imageUrl || `https://placehold.co/40x52`} alt={item.book?.title}
                      onError={e => { e.target.src = `https://placehold.co/40x52`; }}
                      className="w-10 h-12 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.book?.title}</p>
                      <p className="text-xs text-gray-500">{item.book?.author}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(item.totalPrice).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">×{item.quantity} @ ${parseFloat(item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-1.5 text-sm">
              {[['Subtotal', selectedOrder.subtotal], ['Tax', selectedOrder.tax], ['Shipping', selectedOrder.shippingCharge]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>{l}</span><span>${parseFloat(v || 0).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span><span>${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Update Status */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Update Status</h4>
              <div className="flex gap-2 flex-wrap">
                {ORDER_STATUSES.map(s => (
                  <button key={s} onClick={() => handleStatusUpdate(selectedOrder.id, s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${selectedOrder.status === s ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;
