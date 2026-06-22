import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Badge, StarRating } from '../common';
import toast from 'react-hot-toast';

const BookCard = ({ book, onWishlistToggle, isWishlisted }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);

  const discount = book.originalPrice
    ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { toast.error('Please login to add to cart'); return; }
    if (!book.inStock) { toast.error('This book is out of stock'); return; }
    addToCart(book);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { toast.error('Please login to add to wishlist'); return; }
    onWishlistToggle?.(book.id);
  };

  return (
    <Link to={`/books/${book.id}`} className="card group overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-56">
        <img
          src={imgError ? `https://placehold.co/300x400/e2e8f0/64748b?text=${encodeURIComponent(book.title)}` : (book.imageUrl || `https://placehold.co/300x400/e2e8f0/64748b?text=${encodeURIComponent(book.title)}`)}
          alt={book.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
        {discount > 0 && (
          <div className="absolute top-2 left-2">
            <Badge variant="danger">-{discount}%</Badge>
          </div>
        )}
        {book.featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="primary">Featured</Badge>
          </div>
        )}
        {!book.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        {/* Action Buttons */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
          <button onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors
              ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-50'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button onClick={handleAddToCart}
            className="px-4 h-9 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-lg transition-colors">
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Eye className="w-4 h-4 text-gray-700" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{book.category}</p>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-1 line-clamp-2 flex-1">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{book.author}</p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={book.rating || 0} />
          <span className="text-xs text-gray-400">({book.reviewCount || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${parseFloat(book.price).toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${parseFloat(book.originalPrice).toFixed(2)}</span>
            )}
          </div>
          <span className={`text-xs font-medium ${book.inStock ? 'text-green-600' : 'text-red-500'}`}>
            {book.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
