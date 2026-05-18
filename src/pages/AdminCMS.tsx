import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function AdminCMS() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [featuredText, setFeaturedText] = useState('');
  const [velvetProductId, setVelvetProductId] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCMS();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCMS = async () => {
    try {
      const res = await fetch('/api/cms');
      if (res.ok) {
        const data = await res.json();
        setHeroTitle(data?.heroTitle || 'L\'Essence de l\'Élégance');
        setHeroSubtitle(data?.heroSubtitle || 'Crafted Scents For Timeless Presence');
        setHeroImage(data?.heroImage || 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1600&auto=format&fit=crop');
        setFeaturedText(data?.featuredText || 'Every fragrance tells a story. Crafted with precision and inspired by timeless elegance.');
        setVelvetProductId(data?.velvetProductId || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/cms', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ heroTitle, heroSubtitle, heroImage, featuredText, velvetProductId })
      });
      if (res.ok) {
        alert('CMS Settings saved!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading CMS...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Content Management (CMS)</h2>
        <button onClick={handleSave} className="flex items-center gap-2 bg-brand-black text-brand-white px-4 py-2 hover:opacity-80 transition-opacity uppercase tracking-widest text-xs font-medium">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="bg-white p-8 border border-brand-black/10 max-w-4xl space-y-8">
        <div>
          <h3 className="text-sm font-medium tracking-widest uppercase border-b border-brand-black/10 pb-2 mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Hero Title</label>
              <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full border border-brand-black/20 p-2 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Hero Subtitle</label>
              <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="w-full border border-brand-black/20 p-2 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Hero Image URL</label>
              <input type="text" value={heroImage} onChange={(e) => setHeroImage(e.target.value)} className="w-full border border-brand-black/20 p-2 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium tracking-widest uppercase border-b border-brand-black/10 pb-2 mb-4">Homepage Featured Text</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Featured Introduction</label>
              <textarea value={featuredText} onChange={(e) => setFeaturedText(e.target.value)} rows={3} className="w-full border border-brand-black/20 p-2 focus:outline-none focus:border-brand-black transition-colors" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium tracking-widest uppercase border-b border-brand-black/10 pb-2 mb-4">The Velvet Experience</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Recommended Perfume</label>
              <select value={velvetProductId} onChange={(e) => setVelvetProductId(e.target.value)} className="w-full border border-brand-black/20 p-2 focus:outline-none focus:border-brand-black transition-colors">
                <option value="">Default dynamic logic</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
