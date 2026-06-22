import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Grid, List, ChevronDown } from 'lucide-react';
import { bookService } from '../../services/bookstoreService';
import BookCard from './BookCard';
import { BookSkeleton, Pagination, EmptyState } from '../common';
import { BookOpen } from 'lucide-react';

const BookCatalog = ({ showFilters = true }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [view, setView] = useState('grid');
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
  });

  useEffect(() => {
    bookService.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await bookService.getBooks({ query: search || undefined, category: category || undefined, sortBy, page, size: 12 });
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, page]);

  useEffect(() => {
    const timer = setTimeout(fetchBooks, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  useEffect(() => { setPage(0); }, [search, category, sortBy]);

  const toggleWishlist = (bookId) => {
    setWishlist(prev => {
      const updated = prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const sorts = [
    { value: 'title', label: 'Title (A-Z)' }, { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }, { value: 'rating', label: 'Best Rated' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div>
      {showFilters && (
        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by title or author..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="input-field pl-10" />
            </div>
            {/* Category */}
            <div className="relative sm:w-48">
              <select value={category} onChange={e => setCategory(e.target.value)} className="input-field appearance-none pr-8">
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* Sort */}
            <div className="relative sm:w-48">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field appearance-none pr-8">
                {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {/* View Toggle */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {[['grid', Grid], ['list', List]].map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-2 transition-colors ${view === v ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {Array(8).fill(0).map((_, i) => <BookSkeleton key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <EmptyState icon={BookOpen} title="No books found" description="Try adjusting your search or filters" />
      ) : (
        <>
          <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {books.map(book => (
              <BookCard key={book.id} book={book}
                isWishlisted={wishlist.includes(book.id)}
                onWishlistToggle={toggleWishlist} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default BookCatalog;
