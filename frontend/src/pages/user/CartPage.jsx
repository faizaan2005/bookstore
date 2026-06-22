import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/common';
import Navbar from '../../components/layout/Navbar';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 50 ? 0 : (cartTotal > 0 ? 4.99 : 0);
  const total = cartTotal + tax + shipping;

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <EmptyState icon={ShoppingCart} title="Your cart is empty"
          description="Looks like you haven't added any books yet."
          action={<Link to="/dashboard" className="btn-primary">Browse Books</Link>} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart
            <span className="text-lg font-normal text-gray-500 ml-2">({cartCount} items)</span>
          </h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ book, quantity }) => (
              <div key={book.id} className="card p-5 flex gap-5">
                <img
                  src={book.imageUrl || `https://placehold.co/80x100/e2e8f0/64748b?text=Book`}
                  alt={book.title}
                  onError={e => { e.target.src = `https://placehold.co/80x100/e2e8f0/64748b?text=Book`; }}
                  className="w-20 h-24 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/books/${book.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1">
                        {book.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{book.author}</p>
                      <p className="text-xs text-primary-600 mt-1">{book.category}</p>
                    </div>
                    <button onClick={() => removeFromCart(book.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button onClick={() => updateQuantity(book.id, quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-lg transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                      <button onClick={() => updateQuantity(book.id, quantity + 1)} disabled={quantity >= book.stockQuantity}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg transition-colors disabled:opacity-40">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${(parseFloat(book.price) * quantity).toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-400">${parseFloat(book.price).toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                {[['Subtotal', `$${cartTotal.toFixed(2)}`], ['Tax (8%)', `$${tax.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`]].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>{label}</span><span className={val === 'FREE' ? 'text-green-600 font-semibold' : ''}>{val}</span>
                  </div>
                ))}
                {cartTotal > 0 && cartTotal <= 50 && (
                  <p className="text-xs text-amber-600">Add ${(50 - cartTotal).toFixed(2)} more for free shipping!</p>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate(isAuthenticated() ? '/checkout' : '/login')}
                className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              <Link to="/dashboard" className="btn-secondary w-full py-3 text-sm text-center mt-3 block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
