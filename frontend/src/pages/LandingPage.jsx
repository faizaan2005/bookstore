import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Star, Users, Package, TrendingUp, Quote, ChevronRight } from 'lucide-react';
import { bookService } from '../services/bookstoreService';
import BookCard from '../components/books/BookCard';
import { Spinner, StarRating } from '../components/common';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CATEGORIES = [
  { name: 'Fiction', icon: '📚', color: 'from-violet-500 to-purple-600', count: '1.2K+' },
  { name: 'Non-Fiction', icon: '🌍', color: 'from-blue-500 to-cyan-600', count: '800+' },
  { name: 'Self-Help', icon: '🎯', color: 'from-amber-500 to-orange-600', count: '650+' },
  { name: 'Technology', icon: '💻', color: 'from-green-500 to-emerald-600', count: '900+' },
  { name: 'Business', icon: '💼', color: 'from-red-500 to-rose-600', count: '550+' },
  { name: 'Fantasy', icon: '🔮', color: 'from-pink-500 to-fuchsia-600', count: '700+' },
];

const REVIEWS = [
  { name: 'Sarah Johnson', role: 'Book Blogger', rating: 5, text: 'BookVerse has completely transformed my reading experience. The curated selections and seamless interface make book discovery effortless.', avatar: 'SJ' },
  { name: 'Michael Chen', role: 'Software Engineer', rating: 5, text: 'Amazing collection of tech books! The search and filter features are incredibly intuitive. Best online bookstore I have used.', avatar: 'MC' },
  { name: 'Emily Rodriguez', role: 'Literature Professor', rating: 5, text: 'As a literature professor, I appreciate the depth and variety of titles available. The platform is elegant and easy to navigate.', avatar: 'ER' },
];

const STATS = [
  { icon: BookOpen, value: '50,000+', label: 'Books Available', color: 'text-blue-600' },
  { icon: Users, value: '120,000+', label: 'Happy Readers', color: 'text-emerald-600' },
  { icon: Package, value: '500,000+', label: 'Orders Delivered', color: 'text-violet-600' },
  { icon: TrendingUp, value: '4.9/5', label: 'Average Rating', color: 'text-amber-600' },
];

const LandingPage = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookService.getFeatured(), bookService.getNewArrivals()])
      .then(([feat, newArr]) => {
        setFeaturedBooks(feat.data.slice(0, 4));
        setNewArrivals(newArr.data.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 fill-current" /> Rated #1 Online Bookstore 2024
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
                Discover Your Next<br />
                <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                  Great Adventure
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-lg">
                Explore thousands of books across every genre. From timeless classics to modern bestsellers — your perfect read awaits.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
                  Start Reading Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/books" className="px-8 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 font-semibold transition-colors flex items-center gap-2">
                  Browse Library <BookOpen className="w-5 h-5" />
                </Link>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-6 mt-10">
                {[['Free Shipping', 'on orders over $50'], ['Easy Returns', '30-day policy'], ['Secure Payment', 'SSL protected']].map(([title, sub]) => (
                  <div key={title} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{title}</p>
                      <p className="text-gray-400 text-xs">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Book Visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-violet-500/30 rounded-full blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4 p-6">
                  {['📗', '📘', '📕', '📙'].map((emoji, i) => (
                    <div key={i} className={`aspect-[3/4] bg-gradient-to-br ${['from-blue-600 to-blue-800', 'from-violet-600 to-violet-800', 'from-red-600 to-red-800', 'from-amber-600 to-amber-800'][i]} rounded-xl flex items-center justify-center text-4xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-300`}
                      style={{ animationDelay: `${i * 0.1}s` }}>
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 py-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center">
                <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400">Find your perfect genre from our curated collection</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/books?category=${cat.name}`}
              className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${cat.color} text-white text-center hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-xl group`}>
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm">{cat.name}</div>
              <div className="text-xs opacity-80">{cat.count} books</div>
              <ChevronRight className="w-4 h-4 absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Books</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Hand-picked bestsellers for you</p>
            </div>
            <Link to="/books" className="btn-outline text-sm flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-56 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="skeleton h-4 w-3/4" /><div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {featuredBooks.map(book => <BookCard key={book.id} book={book} />)}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">New Arrivals</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Fresh additions to our collection</p>
          </div>
          <Link to="/books?sortBy=newest" className="btn-outline text-sm flex items-center gap-2">
            See More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => <div key={i} className="card overflow-hidden"><div className="skeleton h-56 w-full" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {newArrivals.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-primary-100 text-lg mb-8">Join over 120,000 readers and discover your next favorite book today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-700 hover:bg-gray-50 font-bold px-8 py-3 rounded-lg transition-colors shadow-lg">
              Create Free Account
            </Link>
            <Link to="/books" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-3 rounded-lg transition-colors">
              Browse Books
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What Our Readers Say</h2>
          <p className="text-gray-500 dark:text-gray-400">Trusted by thousands of book lovers worldwide</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map(review => (
            <div key={review.name} className="card p-6 hover:shadow-lg transition-shadow">
              <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-5 text-sm">{review.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.role}</p>
                </div>
                <div className="ml-auto"><StarRating rating={review.rating} /></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
