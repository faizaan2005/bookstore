import React from 'react';
import { BookOpen, TrendingUp, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import BookCatalog from '../../components/books/BookCatalog';
import Navbar from '../../components/layout/Navbar';

const UserDashboard = () => {
  const { user } = useAuth();
  const { cartCount, cartTotal } = useCart();

  const quickStats = [
    { icon: ShoppingBag, label: 'Cart Items', value: cartCount, color: 'bg-blue-500', link: '/cart' },
    { icon: Heart, label: 'Wishlist', value: JSON.parse(localStorage.getItem('wishlist') || '[]').length, color: 'bg-red-500', link: '/wishlist' },
    { icon: BookOpen, label: 'My Orders', value: user?.totalOrders || 0, color: 'bg-green-500', link: '/orders' },
    { icon: TrendingUp, label: 'Cart Total', value: `$${cartTotal.toFixed(2)}`, color: 'bg-violet-500', link: '/cart' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.firstName}! 👋</h1>
              <p className="text-primary-100">Discover your next great read from thousands of titles.</p>
            </div>
            <Link to="/orders" className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
              View My Orders →
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map(({ icon: Icon, label, value, color, link }) => (
            <Link key={label} to={link}
              className="card p-5 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Book Catalog */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📚 Explore Books</h2>
          <BookCatalog />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
