import { useState, useEffect } from 'react';
import { CloudinaryUpload } from '../components/admin/CloudinaryUpload';
import { Download } from 'lucide-react';

export default function AdminProducts() {
  const [images, setImages] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Men');
  const [sizes, setSizes] = useState<{size: string, price: string, compareAtPrice: string}[]>([]);
  const [tags, setTags] = useState('');
  const [vibe, setVibe] = useState('Fresh');
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
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

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const exportCSV = () => {
    if (filteredProducts.length === 0) return;
    const headers = "Name,Category,Price,Compare At Price,Vibe,Tags\n";
    const csv = filteredProducts.map(p => 
      `"${p.name || ''}","${p.category || ''}",${p.price || 0},${p.compareAtPrice || 0},"${p.vibe || ''}","${p.tags?.join(', ') || ''}"`
    ).join("\n");
    
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `products_export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleEdit = (product: any) => {
    setIsEditing(product._id);
    setName(product.name || '');
    setPrice(product.price?.toString() || '');
    setCompareAtPrice(product.compareAtPrice?.toString() || '');
    setStockQuantity(product.stockQuantity?.toString() || '');
    setDescription(product.description || '');
    setCategory(product.category || 'Men');
    setSizes(product.sizes || []);
    setTags(product.tags?.join(', ') || '');
    setVibe(product.vibe || 'Fresh');
    setImages(product.images || (product.image ? [product.image] : []));
    if (product.details) {
      setTopNotes(product.details.topNotes?.join(', ') || '');
      setHeartNotes(product.details.heartNotes?.join(', ') || '');
      setBaseNotes(product.details.baseNotes?.join(', ') || '');
    } else {
      setTopNotes('');
      setHeartNotes('');
      setBaseNotes('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setIsEditing(null);
    setName('');
    setPrice('');
    setCompareAtPrice('');
    setStockQuantity('');
    setDescription('');
    setCategory('Men');
    setSizes([]);
    setTags('');
    setVibe('Fresh');
    setImages([]);
    setTopNotes('');
    setHeartNotes('');
    setBaseNotes('');
  }

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteProductId(id);
  }

  const handleDelete = async () => {
    if (!deleteProductId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/products/${deleteProductId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteProductId(null);
    }
  };

  const handleSaveProduct = async () => {
    if (!name || !price) return;
    try {
      const token = localStorage.getItem('token');
      
      const productData = { 
        name, 
        price: Number(price), 
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stockQuantity: stockQuantity ? Number(stockQuantity) : 0,
        image: images.length > 0 ? images[0] : '',
        images: images,
        description,
        category,
        sizes,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        vibe,
        details: {
          topNotes: topNotes.split(',').map(n => n.trim()).filter(Boolean),
          heartNotes: heartNotes.split(',').map(n => n.trim()).filter(Boolean),
          baseNotes: baseNotes.split(',').map(n => n.trim()).filter(Boolean)
        }
      };

      const url = isEditing ? `/api/products/${isEditing}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (res.ok) {
        handleCancelEdit();
        fetchProducts();
      } else {
        const errorData = await res.json();
        console.error('Failed to save product:', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Products Management</h2>
      
      <div className="bg-white p-8 border border-brand-black/10 max-w-2xl mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-medium tracking-widest uppercase">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          {isEditing && (
            <button onClick={handleCancelEdit} className="text-xs uppercase tracking-widest text-[#555] hover:text-brand-black">Cancel</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="e.g. Santal Mystique" />
          </div>
          
          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Price</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="240" />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Compare At Price (Optional)</label>
            <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="300" />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent">
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Bundles">Bundles</option>
              <option value="Gift Sets">Gift Sets</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Stock Quantity</label>
            <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="e.g. 50" />
          </div>

          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4 mt-4">
              <h4 className="text-xs font-medium uppercase tracking-widest text-brand-black">Sizes & Prices</h4>
              <button 
                onClick={(e) => { e.preventDefault(); setSizes([...sizes, {size: '', price: '', compareAtPrice: ''}]); }}
                className="text-xs font-medium text-brand-black hover:text-brand-black/70 uppercase tracking-wider"
              >
                + Add Size
              </button>
            </div>
            <div className="space-y-4">
              {sizes.map((s, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-[#555] block mb-1">Size (e.g. 50ml)</label>
                    <input type="text" value={s.size} onChange={(e) => { const newSizes = [...sizes]; newSizes[idx].size = e.target.value; setSizes(newSizes); }} className="w-full border-b border-brand-black/30 pb-1 px-2 focus:outline-none focus:border-brand-black text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#555] block mb-1">Price</label>
                    <input type="number" value={s.price} onChange={(e) => { const newSizes = [...sizes]; newSizes[idx].price = e.target.value; setSizes(newSizes); }} className="w-full border-b border-brand-black/30 pb-1 px-2 focus:outline-none focus:border-brand-black text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-[#555] block mb-1">Compare At</label>
                    <input type="number" value={s.compareAtPrice} onChange={(e) => { const newSizes = [...sizes]; newSizes[idx].compareAtPrice = e.target.value; setSizes(newSizes); }} className="w-full border-b border-brand-black/30 pb-1 px-2 focus:outline-none focus:border-brand-black text-sm" />
                  </div>
                  <button onClick={(e) => { e.preventDefault(); setSizes(sizes.filter((_, i) => i !== idx)); }} className="text-red-500 hover:text-red-700 pb-1 px-2">×</button>
                </div>
              ))}
              {sizes.length === 0 && <p className="text-xs text-[#888] italic">No specific sizes defined. Will use base price.</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Vibe</label>
            <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent">
              <option value="Fresh">Fresh</option>
              <option value="Floral">Floral</option>
              <option value="Woody">Woody</option>
              <option value="Oriental">Oriental</option>
              <option value="Citrus">Citrus</option>
              <option value="Spicy">Spicy</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Tags (comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="New, Best Seller" />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="A rich, woody scent..." />
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-brand-black mt-4 mb-4">Fragrance Notes (comma separated)</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Top Notes</label>
                <input type="text" value={topNotes} onChange={(e) => setTopNotes(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="Bergamot, Lemon" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Heart Notes</label>
                <input type="text" value={heartNotes} onChange={(e) => setHeartNotes(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="Rose, Jasmine" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-[#555] mb-2 block">Base Notes</label>
                <input type="text" value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black transition-colors rounded-none bg-transparent" placeholder="Sandalwood, Vanilla" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-medium uppercase tracking-widest text-brand-black mt-4 mb-4">Product Images (3-6 recommended)</h4>
            <div className="flex flex-wrap gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-32 h-32 border border-brand-black/10">
                  <img src={img} alt={`Product ${idx+1}`} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-white text-red-500 w-6 h-6 flex items-center justify-center text-xs hover:bg-black hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {images.length < 6 && (
              <CloudinaryUpload 
                label={`Upload Image ${images.length + 1}`} 
                onUpload={(url) => setImages([...images, url])} 
              />
            )}
          </div>
          
          <div className="md:col-span-2 mt-4">
            <button onClick={handleSaveProduct} className="bg-brand-black text-brand-white px-8 py-3 text-xs font-medium uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors">
              {isEditing ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border border-brand-black/10 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-medium tracking-widest uppercase">Existing Products</h3>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-medium rounded hover:bg-zinc-50 transition"
            >
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <div className="w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-b border-brand-black/30 pb-2 px-2 text-sm focus:outline-none focus:border-brand-black transition-colors bg-transparent"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-black/10 text-xs uppercase tracking-widest text-[#555]">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-black/5">
              {filteredProducts.map(p => (
                <tr key={p._id}>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-cream shrink-0">
                        {p.images && p.images.length > 0 ? (
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : p.image && (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="font-serif">{p.name || 'Unnamed Product'}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-[#555]">{p.category || 'N/A'}</td>
                  <td className="py-4 text-sm">
                    {p.stockQuantity === 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-[10px] rounded uppercase tracking-widest">Out of Stock</span>
                    ) : p.stockQuantity < 10 ? (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] rounded uppercase tracking-widest">Low Stock ({p.stockQuantity})</span>
                    ) : (
                      <span className="text-[#555]">{p.stockQuantity || 0}</span>
                    )}
                  </td>
                  <td className="py-4 text-sm font-medium">${p.price}</td>
                  <td className="py-4 text-right space-x-4 text-xs font-medium uppercase tracking-widest">
                    <button onClick={() => handleEdit(p)} className="text-brand-black hover:opacity-70 transition-opacity">Edit</button>
                    <button onClick={() => confirmDelete(p._id)} className="text-red-500 hover:opacity-70 transition-opacity">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <h3 className="font-serif text-xl tracking-tight text-brand-black mb-2">Delete Product</h3>
            <p className="text-zinc-500 text-sm mb-6">Are you sure you want to delete this specific product? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteProductId(null)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition bg-zinc-100 hover:bg-zinc-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
