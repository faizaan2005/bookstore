import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        toast.success('Cart updated!');
        return prev.map(item => item.book.id === book.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, book.stockQuantity) }
          : item);
      }
      toast.success('Added to cart!');
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.book.id !== bookId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (bookId, quantity) => {
    if (quantity <= 0) { removeFromCart(bookId); return; }
    setCart(prev => prev.map(item => item.book.id === bookId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
