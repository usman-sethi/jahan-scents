import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudinaryUpload } from '../components/admin/CloudinaryUpload';

export default function AdminSliders() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    image: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const res = await fetch('/api/sliders');
      if (res.ok) {
        setSliders(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      link: '',
      image: '',
      order: 0,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEdit = (slider: any) => {
    setEditingId(slider._id);
    setFormData({
      title: slider.title || '',
      subtitle: slider.subtitle || '',
      link: slider.link || '',
      image: slider.image || '',
      order: slider.order || 0,
      isActive: slider.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId ? `/api/admin/sliders/${editingId}` : '/api/admin/sliders';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSliders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/sliders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSliders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-brand-black">Sliders</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-brand-black text-brand-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-black/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Slider
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map(slider => (
          <div key={slider._id} className="bg-white border border-brand-black/10 overflow-hidden group">
            <div className="aspect-[16/9] relative bg-brand-black/5">
              {slider.image ? (
                <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-black/30">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(slider)}
                  className="bg-white p-2 rounded shadow text-brand-black hover:text-brand-gold transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slider._id)}
                  className="bg-white p-2 rounded shadow text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {!slider.isActive && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-sm uppercase font-bold tracking-wider">
                  Hidden
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-brand-black truncate">{slider.title || 'Untitled'}</h3>
              <p className="text-sm text-brand-black/60 truncate mt-1">{slider.subtitle || '-'}</p>
              <div className="text-xs text-brand-black/40 mt-3 flex justify-between">
                <span>Order: {slider.order}</span>
                {slider.link && <span className="truncate ml-4">{slider.link}</span>}
              </div>
            </div>
          </div>
        ))}
        {sliders.length === 0 && (
          <div className="col-span-full py-12 text-center text-brand-black/50 border border-dashed border-brand-black/20">
            No sliders created yet. Add your first slider for the homepage carousel.
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white w-full max-w-xl relative z-10 p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-brand-black/50 hover:text-brand-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-serif text-brand-black mb-6">
                {editingId ? 'Edit Slider' : 'Add New Slider'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">Slider Image *</label>
                  {formData.image ? (
                    <div className="relative mb-2 aspect-[16/9] border border-brand-black/10">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 bg-brand-black text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <CloudinaryUpload
                      label="Upload Slider Banner"
                      onUpload={(url) => setFormData({ ...formData, image: url })}
                    />
                  )}
                  <p className="text-[10px] text-brand-black/40 mt-1">Recommended size: 1920x1080px (16:9 ratio)</p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-brand-black/20 p-2 text-sm focus:outline-none focus:border-brand-black"
                    placeholder="e.g. L'Essence de l'Élégance"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">Subtitle / Text</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border border-brand-black/20 p-2 text-sm focus:outline-none focus:border-brand-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">Button Link</label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full border border-brand-black/20 p-2 text-sm focus:outline-none focus:border-brand-black"
                      placeholder="e.g. /collection/50ml"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#555] mb-2">Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full border border-brand-black/20 p-2 text-sm focus:outline-none focus:border-brand-black"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-black/10">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-brand-black w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm cursor-pointer select-none">
                    Active (Show on website)
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-brand-black/20 text-brand-black text-xs uppercase tracking-widest hover:bg-brand-black/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-black text-brand-white text-xs uppercase tracking-widest hover:bg-brand-black/90 transition-colors"
                  >
                    Save Slider
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
