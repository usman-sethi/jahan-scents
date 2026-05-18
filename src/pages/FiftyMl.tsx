import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FiftyMl() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if(Array.isArray(data)) {
          // Filter products based on size (or if category explicitly says '50ml')
          setDbProducts(data.filter(p => p.size === '50ml' || p.category?.toLowerCase() === '50ml'));
        }
      })
      .catch(console.error);
  }, []);

  const staticProducts = [
    {
      id: "50ml-1",
      name: "SANTAL MYSTIQUE - 50ML",
      category: "Signature",
      price: "6,500.00",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "50ml-2",
      name: "OUD MAJESTÉ - 50ML",
      category: "Intense",
      price: "7,500.00",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "50ml-3",
      name: "BLANC SANTAL - 50ML",
      category: "Fresh",
      price: "5,500.00",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "50ml-4",
      name: "NOIR ABSOLU - 50ML",
      category: "Woody",
      price: "6,000.00",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "50ml-5",
      name: "ROSE NUIT - 50ML",
      category: "Floral",
      price: "6,800.00",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "50ml-6",
      name: "VETIVER SAUVAGE - 50ML",
      category: "Fresh",
      price: "6,200.00",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const products = [
    ...dbProducts.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category || "Custom",
      price: p.price,
      image: p.image || p.images?.[0] || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
      images: p.images || []
    })),
    ...staticProducts
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <h1 className="text-4xl md:text-5xl font-serif text-brand-black mb-4">The 50ML Collection</h1>
        <p className="text-[#555] mb-12 max-w-xl text-sm leading-relaxed">
          Your signature scents, now in a perfectly curated 50ml edition. Ideal for travel or discovering a new everyday favorite.
        </p>

        {/* Attractive Banner / Best Sellers Highlight */}
        <div className="mb-20 bg-brand-cream/30 border border-brand-black/5 overflow-hidden flex flex-col md:flex-row">
          <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[#555] mb-4 block">Customer Favorites</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-4">Most Selling 50ML</h2>
            <p className="text-[#555] mb-8 max-w-md text-sm leading-relaxed">
              Experience the fragrances our community loves the most. Hand-picked, perfectly sized, and undeniably captivating. These are the scents flying off our shelves.
            </p>
            <div>
              <a href="#all-collection" className="bg-brand-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-black/80 transition-colors inline-block">
                Discover the Collection
              </a>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-px bg-brand-black/5">
            {products.slice(0, 2).map((product) => (
              <Link key={`best-${product.id}`} to={`/product/${product.id}`} className="group cursor-pointer block bg-white relative overflow-hidden">
                <div className="aspect-[4/5] bg-brand-cream/50">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : ''}`}
                  />
                   {product.images && product.images.length > 1 && (
                    <img 
                      src={product.images[1]} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[10px] uppercase tracking-widest opacity-80 mb-1 block">Best Seller</span>
                  <h3 className="font-serif text-lg">{product.name}</h3>
                </div>
                {/* Sale Badge / Attractant */}
                 <div className="absolute top-4 right-4 bg-brand-black text-white text-[9px] uppercase tracking-widest px-2 py-1">
                  Trending
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div id="all-collection" className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif text-brand-black">All 50ML Editions</h2>
          <span className="text-xs uppercase tracking-widest text-[#555]">{products.length} Products</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream/50 mb-6 border border-brand-black/5">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0' : ''}`}
                />
                {product.images && product.images.length > 1 && (
                  <img 
                    src={product.images[1]} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                  />
                )}
                <div className="absolute inset-0 bg-brand-black/20 opacity-0 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-2 block">{product.category}</span>
                <h3 className="font-serif text-xl text-brand-black mb-2">{product.name}</h3>
                <p className="text-[13px] tracking-wide text-brand-black font-medium">Rs. {product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
