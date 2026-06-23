import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../../services/api';
import Spinner from '../../components/ui/Spinner';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data || []);
    } catch (err) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setEditingId(category._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? (It will be removed from all associated books)')) {
      try {
        await API.delete(`/admin/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingId) {
        await API.put(`/admin/categories/${editingId}`, formData);
        toast.success('Category updated');
      } else {
        await API.post('/admin/categories', formData);
        toast.success('Category created');
      }
      fetchCategories();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-32"><Spinner size="xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter page-enter-active">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-500 font-display">Manage Categories</h1>
          <p className="text-gray-500">Create and organize book categories</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-accent flex items-center gap-2">
          <FiPlus /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Total Books</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-surface-50">
                  <td className="px-6 py-4 font-semibold text-primary-500">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{cat.description || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="bg-surface-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                      {cat.bookCount || 0} books
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No categories found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={resetForm} />
          <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-surface-200">
              <h2 className="text-xl font-bold text-primary-500">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2"><FiX className="w-6 h-6" /></button>
            </div>
            
            <div className="p-6">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="e.g. Fiction" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field resize-none" placeholder="Category description..."></textarea>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-surface-200 bg-surface-50 flex justify-end gap-4">
              <button type="button" onClick={resetForm} className="btn-outline px-6">Cancel</button>
              <button type="submit" form="category-form" disabled={isSubmitting} className="btn-primary px-8">
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
