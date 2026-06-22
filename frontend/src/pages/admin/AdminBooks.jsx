import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { adminService, bookService } from '../../services/bookstoreService';
import { Spinner, Badge, Modal, Pagination, EmptyState } from '../../components/common';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const defaultBook = { title: '', author: '', description: '', price: '', originalPrice: '', category: '', isbn: '', publisher: '', language: 'English', pages: '', imageUrl: '', stockQuantity: 0, featured: false, active: true };

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState(defaultBook);
  const [saving, setSaving] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await bookService.getBooks({ query: search || undefined, page, size: 10 });
      setBooks(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchBooks, search ? 400 : 0);
    return () => clearTimeout(t);
  }, [search, page]);

  const openCreate = () => { setEditBook(null); setForm(defaultBook); setModalOpen(true); };
  const openEdit = (book) => { setEditBook(book); setForm({ ...book }); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editBook) {
        await adminService.updateBook(editBook.id, form);
        toast.success('Book updated!');
      } else {
        await adminService.createBook(form);
        toast.success('Book created!');
      }
      setModalOpen(false);
      fetchBooks();
    } catch {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await adminService.deleteBook(id);
      toast.success('Book deleted');
      fetchBooks();
    } catch {
      toast.error('Delete failed');
    }
  };

  const CATEGORIES = ['Fiction', 'Non-Fiction', 'Self-Help', 'Technology', 'Business', 'Fantasy', 'Dystopian', 'Finance', 'Science'];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Book Management</h1>
          <button onClick={openCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>

        <div className="card p-5">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search books..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="input-field pl-10 max-w-sm" />
          </div>

          {loading ? <div className="flex justify-center py-10"><Spinner /></div> : books.length === 0 ? (
            <EmptyState icon={Package} title="No books found" description="Add your first book" action={<button onClick={openCreate} className="btn-primary">Add Book</button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {['Book', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {books.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={book.imageUrl || `https://placehold.co/40x52`} alt={book.title}
                            onError={e => { e.target.src = `https://placehold.co/40x52`; }}
                            className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">{book.title}</p>
                            <p className="text-xs text-gray-500">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><Badge variant="primary">{book.category}</Badge></td>
                      <td className="py-3 px-4 font-semibold">${parseFloat(book.price).toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${book.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>{book.stockQuantity}</span>
                      </td>
                      <td className="py-3 px-4">⭐ {book.rating?.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={book.active ? 'success' : 'danger'}>{book.active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(book)} className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(book.id, book.title)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      </div>

      {/* Book Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editBook ? 'Edit Book' : 'Add New Book'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[['Title', 'title', 'text', true], ['Author', 'author', 'text', true], ['ISBN', 'isbn', 'text', false], ['Publisher', 'publisher', 'text', false], ['Language', 'language', 'text', false], ['Pages', 'pages', 'number', false]].map(([label, key, type, req]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                <input type={type} className="input-field" value={form[key] || ''} required={req}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Quantity</label>
              <input type="number" min="0" className="input-field" value={form.stockQuantity}
                onChange={e => setForm({ ...form, stockQuantity: parseInt(e.target.value) || 0 })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={form.price || ''}
                onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price ($)</label>
              <input type="number" step="0.01" min="0" className="input-field" value={form.originalPrice || ''}
                onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
            <input type="url" className="input-field" value={form.imageUrl || ''}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea className="input-field resize-none" rows={3} value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-4">
            {[['featured', 'Featured Book'], ['active', 'Active']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">
              {saving ? 'Saving...' : (editBook ? 'Update Book' : 'Create Book')}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminBooks;
