import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import { formatPrice } from '../../utils/formatPrice';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', originalPrice: '',
    stock: '', category: '', isbn: '', publisher: '', publishedYear: '',
    pages: '', language: 'English', isBestSeller: false, isNewArrival: false
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchData = async () => {
    try {
      const [booksRes, catRes] = await Promise.all([
        API.get('/books?limit=100'),
        API.get('/categories')
      ]);
      setBooks(booksRes.data.books || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '', author: '', description: '', price: '', originalPrice: '',
      stock: '', category: '', isbn: '', publisher: '', publishedYear: '',
      pages: '', language: 'English', isBestSeller: false, isNewArrival: false
    });
    setImageFile(null);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description || '',
      price: book.price,
      originalPrice: book.originalPrice || '',
      stock: book.stock,
      category: book.category?._id || book.category,
      isbn: book.isbn || '',
      publisher: book.publisher || '',
      publishedYear: book.publishedYear || '',
      pages: book.pages || '',
      language: book.language || 'English',
      isBestSeller: book.isBestSeller || false,
      isNewArrival: book.isNewArrival || false
    });
    setEditingId(book._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await API.delete(`/admin/books/${id}`);
        toast.success('Book deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imageUrl = null;
      
      // Upload image first if exists
      if (imageFile) {
        const imgData = new FormData();
        imgData.append('image', imageFile);
        const uploadRes = await API.post('/upload', imgData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      const bookData = { ...formData };
      if (imageUrl) {
        bookData.images = [imageUrl];
      }

      if (editingId) {
        await API.put(`/admin/books/${editingId}`, bookData);
        toast.success('Book updated successfully');
      } else {
        await API.post('/admin/books', bookData);
        toast.success('Book created successfully');
      }
      
      fetchData();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter page-enter-active">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 font-display">Manage Books</h1>
          <p className="text-gray-500">Add, edit, or remove books from inventory</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-accent flex items-center gap-2">
          <FiPlus /> Add New Book
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Book</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-surface-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-surface-200 rounded overflow-hidden">
                        <img src={book.images?.[0] || '/placeholder-book.jpg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary-500 truncate max-w-[200px]">{book.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{book.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-primary-500">{formatPrice(book.price)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${book.stock > 10 ? 'bg-green-100 text-green-600' : book.stock > 0 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
                      {book.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(book)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-surface-200">
              <h2 className="text-xl font-bold text-primary-500">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2"><FiX className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="book-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
                    <div className="border-2 border-dashed border-surface-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-50 transition-colors">
                      <FiImage className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-1">Click to upload image</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="text-sm"
                      />
                      {imageFile && <p className="text-xs text-accent-500 mt-2 font-medium">Selected: {imageFile.name}</p>}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Title *</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Author *</label><input type="text" required value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="input-field" /></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field">
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Price *</label><input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label><input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className="input-field" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label><input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="input-field" /></div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label><input type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label><input type="text" value={formData.publisher} onChange={e => setFormData({...formData, publisher: e.target.value})} className="input-field" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label><input type="number" value={formData.publishedYear} onChange={e => setFormData({...formData, publishedYear: e.target.value})} className="input-field" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Pages</label><input type="number" value={formData.pages} onChange={e => setFormData({...formData, pages: e.target.value})} className="input-field" /></div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Language</label><input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="input-field" /></div>
                    
                    <div className="flex gap-4 pt-4">
                      <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} className="w-4 h-4 text-accent-400 focus:ring-accent-400 rounded border-gray-300" /> Best Seller
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <input type="checkbox" checked={formData.isNewArrival} onChange={e => setFormData({...formData, isNewArrival: e.target.checked})} className="w-4 h-4 text-accent-400 focus:ring-accent-400 rounded border-gray-300" /> New Arrival
                      </label>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none"></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-surface-200 bg-surface-50 flex justify-end gap-4 shrink-0">
              <button type="button" onClick={resetForm} className="btn-outline px-6">Cancel</button>
              <button type="submit" form="book-form" disabled={isSubmitting} className="btn-primary px-8">
                {isSubmitting ? 'Saving...' : 'Save Book'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
