import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ArrowLeft, Star, Package, Truck, RefreshCw, Share2 } from 'lucide-react';
import { bookService } from '../../services/bookstoreService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Spinner, StarRating, Badge } from '../../components/common';
import Navbar from '../../components/layout/Navbar';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    bookService.getBook(id).then(r => setBook(r.data)).catch(() => navigate(-1)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!book) return null;

  const discount = book.originalPrice ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!isAuthenticated()) { toast.error('Please login'); navigate('/login'); return; }
    addToCart(book, qty);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Image */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-24">
              <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
                <img
                  src={imgError ? `https://placehold.co/400x533/e2e8f0/64748b?text=${encodeURIComponent(book.title)}` : (book.imageUrl || `https://placehold.co/400x533/e2e8f0/64748b?text=${encodeURIComponent(book.title)}`)}
                  alt={book.title} onError={() => setImgError(true)}
                  className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleAddToCart} disabled={!book.inStock}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                  <ShoppingCart className="w-5 h-5" />
                  {book.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <Badge variant="primary" className="mb-3">{book.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">by <span className="text-primary-600 font-semibold">{book.author}</span></p>

              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={book.rating || 0} size="md" />
                <span className="text-gray-500 text-sm">({book.reviewCount || 0} reviews)</span>
                <span className={`font-medium ${book.inStock ? 'text-green-600' : 'text-red-500'}`}>
                  {book.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">${parseFloat(book.price).toFixed(2)}</span>
                {book.originalPrice && <span className="text-xl text-gray-400 line-through">${parseFloat(book.originalPrice).toFixed(2)}</span>}
                {discount > 0 && <Badge variant="danger" className="text-sm">{discount}% OFF</Badge>}
              </div>

              {/* Quantity */}
              {book.inStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l-lg transition-colors text-lg">−</button>
                    <span className="w-12 text-center font-semibold">{qty}</span>
                    <button onClick={() => setQty(q => Math.min(book.stockQuantity, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg transition-colors text-lg">+</button>
                  </div>
                  <span className="text-sm text-gray-500">{book.stockQuantity} available</span>
                </div>
              )}

              <button onClick={handleAddToCart} disabled={!book.inStock}
                className="btn-primary w-full sm:w-auto px-10 py-3 text-base flex items-center gap-2 mb-6">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100 dark:border-gray-700">
                {[[Truck, 'Free Shipping', 'Orders over $50'], [RefreshCw, '30-Day Returns', 'Easy policy'], [Package, 'Secure Packing', 'Safe delivery']].map(([Icon, title, sub]) => (
                  <div key={title} className="text-center">
                    <Icon className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{title}</p>
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About this book</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{book.description}</p>
              </div>
            )}

            {/* Book Details */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Book Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {[['ISBN', book.isbn], ['Publisher', book.publisher], ['Language', book.language || 'English'], ['Pages', book.pages]].filter(([, v]) => v).map(([key, val]) => (
                  <div key={key}>
                    <dt className="text-xs text-gray-500">{key}</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{val}</dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
