import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (productId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ productId })
      });
      setWishlist(wishlist.filter(item => item.productId !== productId));
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">Loading...</div>;

  return (
    <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12 min-h-screen">
      <h1 className="text-3xl lg:text-4xl font-serif text-brand-black mb-12">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div>
          <p className="text-brand-black/60 mb-6">Your wishlist is empty.</p>
          <Link to="/" className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors inline-block">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlist.map((item) => (
            <div key={item._id} className="group relative">
              <Link to={`/product/${item.productId}`}>
                <div className="aspect-[4/5] bg-brand-cream relative overflow-hidden mb-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                </div>
              </Link>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-serif mb-1">{item.name}</h3>
                  <p className="text-sm text-brand-black/60">${item.price}</p>
                </div>
                <button onClick={() => handleRemove(item.productId)} className="text-[10px] uppercase tracking-widest hover:text-brand-taupe transition-colors">Remove</button>
              </div>
              <button 
                onClick={() => addToCart({ id: item.productId, name: item.name, price: item.price, image: item.image, quantity: 1 })}
                className="w-full border border-brand-black/20 py-3 text-[11px] uppercase tracking-widest hover:border-brand-black transition-colors"
              >
                Move to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
