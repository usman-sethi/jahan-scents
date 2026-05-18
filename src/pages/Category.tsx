import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Category() {
  const { categoryId } = useParams();
  const categoryName = categoryId ? categoryId.replace('-', ' ') : 'Category';

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
          const filtered = data.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase() || !p.category);
          setDbProducts(filtered);
        }
      })
      .catch(console.error);
  }, [categoryName]);

  const staticProducts = [
    {
      id: 1,
      name: "LACEDA",
      category: "Signature",
      price: "10,999.00",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "OUD MAJESTÉ",
      category: "Intense",
      price: "12,500.00",
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "BLANC SANTAL",
      category: "Fresh",
      price: "9,500.00",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "NOIR ABSOLU",
      category: "Woody",
      price: "11,000.00",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const products = [
    ...dbProducts.map(p => ({
      id: p._id,
      name: p.name,
      category: "Custom",
      price: p.price,
      image: p.image || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
      images: p.images || []
    })),
    ...staticProducts
  ];

  return (
    <>
      <Helmet>
        <title>{`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Fragrances | JAHAN`}</title>
        <meta name="description" content={`Discover our curated collection of fragrances for ${categoryName}.`} />
      </Helmet>
      <div className="pt-32 pb-24 min-h-screen bg-brand-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="mb-16 border-b border-brand-black/10 pb-12 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-light text-brand-black mb-6 capitalize">{categoryName}</h1>
            <p className="text-[#555] text-sm leading-relaxed tracking-wide">
              Discover our curated collection of fragrances for {categoryName}. Elevate your everyday with notes that linger long after you leave.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group flex flex-col h-full cursor-pointer">
              <div className="relative block aspect-[4/5] bg-brand-taupe/10 mb-6 overflow-hidden group-hover:opacity-90 transition-opacity duration-500">
                <img 
                  src={product.image} 
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${product.images && product.images.length > 1 ? 'opacity-100 group-hover:opacity-0' : 'group-hover:scale-105'}`}
                />
                
                {product.images && product.images.length > 1 && (
                  <img
                    src={product.images[1]}
                    alt={`${product.name} alternate view`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
                  />
                )}
              </div>
              <div className="flex flex-col flex-1 text-center px-4">
                <h3 className="font-serif text-[20px] tracking-wide font-light mb-1.5 transition-colors duration-300 group-hover:text-brand-taupe">{product.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-black/50 mb-3 block font-medium">{product.category}</span>
                <p className="text-[13px] text-brand-black font-medium tracking-wider mt-auto pt-2">Rs. {product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
