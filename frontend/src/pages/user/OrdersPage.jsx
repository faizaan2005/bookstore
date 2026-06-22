import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronRight, ShoppingBag } from 'lucide-react';
import { orderService } from '../../services/bookstoreService';
import { Spinner, Badge, EmptyState, Pagination } from '../../components/common';
import Navbar from '../../components/layout/Navbar';

const STATUS_CONFIG = {
  PENDING: { color: 'warning', icon: Clock },
  CONFIRMED: { color: 'info', icon: CheckCircle },
  PROCESSING: { color: 'info', icon: Package },
  SHIPPED: { color: 'primary', icon: Truck },
  DELIVERED: { color: 'success', icon: CheckCircle },
  CANCELLED: { color: 'danger', icon: XCircle },
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    orderService.getMyOrders({ page, size: 10 })
      .then(r => { setOrders(r.data.content); setTotalPages(r.data.totalPages); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No orders yet"
            description="Start shopping to see your orders here"
            action={<Link to="/dashboard" className="btn-primary">Browse Books</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusConfig.icon;
              return (
                <div key={order.id} className="card p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={statusConfig.color} className="px-3 py-1">
                        <StatusIcon className="w-3.5 h-3.5 mr-1.5 inline" /> {order.status}
                      </Badge>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">${parseFloat(order.totalAmount).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap mb-4">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                        <img src={item.book.imageUrl || `https://placehold.co/40x50`} alt={item.book.title}
                          onError={e => { e.target.src = `https://placehold.co/40x50`; }}
                          className="w-9 h-11 object-cover rounded" />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[120px]">{item.book.title}</p>
                          <p className="text-xs text-gray-400">×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-500">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center gap-1 mb-4">
                    {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((s, i, arr) => {
                      const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                      const orderIdx = statuses.indexOf(order.status);
                      const filled = i <= orderIdx;
                      return (
                        <React.Fragment key={s}>
                          <div className={`w-2.5 h-2.5 rounded-full transition-colors ${filled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                          {i < arr.length - 1 && <div className={`flex-1 h-0.5 transition-colors ${i < orderIdx ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.paymentMethod}
                    </div>
                    <Link to={`/orders/${order.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1">
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
