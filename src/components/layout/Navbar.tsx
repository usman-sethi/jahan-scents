import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const links = ['Men', 'Women', 'Bundles', 'Gift Sets'];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isCartOpen: cartOpen, setIsCartOpen: setCartOpen, cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href='/';
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const fetchWishlistCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistCount(data.length || 0);
        }
      } catch (e) {}
    };
    
    fetchWishlistCount();

    const handleWishlistUpdate = () => fetchWishlistCount();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const fetchSearchResults = async () => {
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const data = await res.json();
            const queryLower = searchQuery.toLowerCase().trim();
            const queryChars = queryLower.replace(/\s+/g, '').split('');
            
            const scoredProducts = data.map((p: any) => {
              const nameLower = p.name.toLowerCase();
              const nameChars = nameLower.replace(/\s+/g, '').split('');
              let score = 0;
              
              if (nameLower === queryLower) score += 100;
              else if (nameLower.startsWith(queryLower)) score += 50;
              else if (nameLower.includes(queryLower)) score += 30;

              let lettersMatched = 0;
              for (const char of queryChars) {
                const idx = nameChars.indexOf(char);
                if (idx !== -1) {
                  lettersMatched++;
                  nameChars.splice(idx, 1);
                }
              }
              
              const letterMatchRatio = queryChars.length > 0 ? (lettersMatched / queryChars.length) : 0;
              score += letterMatchRatio * 20;

              // Give a boost if all letters from the query are present in the name
              if (lettersMatched === queryChars.length) {
                  score += 15;
              }

              return { ...p, _score: score };
            });

            const filtered = scoredProducts
              .filter(p => p._score > 15 || p.name.toLowerCase().includes(queryLower))
              .sort((a, b) => b._score - a._score);
              
            setSearchResults(filtered);
          }
        } catch (err) {
          console.error(err);
        }
      };
      
      const timeoutId = setTimeout(fetchSearchResults, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when drawers are open
  useEffect(() => {
    if (mobileMenuOpen || cartOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, cartOpen, searchOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled || searchOpen ? 'bg-brand-cream/80 backdrop-blur-xl py-4 border-b border-black/5 shadow-sm' : 'bg-transparent py-8'
        )}
        style={{ marginTop: isScrolled ? 0 : '32px' }}
      >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col">
        {/* Top Row: Brand & Icons */}
        <div className="flex items-center justify-between mb-4 md:mb-6 w-full">
          {/* Brand (Left) */}
          <div className="flex-1 md:flex-none">
            <Link to="/" className="inline-flex items-center gap-4">
              <img src="/logo.svg" alt="JAHAN" className="h-8 md:h-12 w-auto object-contain mix-blend-darken" />
              <span className="block font-serif text-[26px] md:text-[32px] tracking-[0.25em] font-light text-brand-black uppercase">JAHAN</span>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex justify-end items-center gap-6 md:gap-10 text-[10px] font-medium uppercase tracking-[0.15em] text-brand-black">
            <button 
              className="hover:opacity-70 transition-opacity hidden md:flex items-center gap-2"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4" strokeWidth={1.5} /> SEARCH
            </button>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/account'} className="hidden sm:flex hover:opacity-70 transition-opacity items-center gap-2">
                <User className="w-4 h-4" strokeWidth={1.5} /> {user.role === 'admin' ? 'ADMIN' : 'ACCOUNT'}
              </Link>
            ) : (
              <Link to="/login" className="hidden sm:flex hover:opacity-70 transition-opacity items-center gap-2">
                <User className="w-4 h-4" strokeWidth={1.5} /> PROFILE
              </Link>
            )}
            <Link to="/wishlist" className="hidden sm:flex hover:opacity-70 transition-opacity items-center gap-2">
              <Heart className="w-4 h-4" strokeWidth={1.5} /> WISHLIST {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <button 
              className="hover:opacity-70 transition-opacity relative group hidden md:flex items-center gap-2"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} /> BAG ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </button>
            
            <button 
              className="md:hidden hover:opacity-70 transition-opacity"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <button 
              className="md:hidden hover:opacity-70 transition-opacity relative group"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-1.5 bg-brand-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium group-hover:scale-110 transition-transform">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>
            
            <button 
              className="md:hidden ml-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Links (Desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {links.map((link) => (
            <a
              key={link}
              href={`/${link.toLowerCase().replace(' ', '-')}`}
              className="text-[11px] font-medium uppercase tracking-[0.15em] relative group overflow-hidden text-brand-black/80 hover:text-brand-black transition-colors"
            >
              {link}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-brand-black origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </div>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-brand-cream z-50 p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-b border-brand-black/5"
          >
            <div className="max-w-[800px] mx-auto relative flex items-center">
              <Search className="w-6 h-6 text-brand-black/50 absolute left-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances, gifts..." 
                className="w-full bg-transparent border-b-2 border-brand-black/20 focus:border-brand-black pb-4 pt-4 pl-14 pr-12 text-xl md:text-2xl font-serif text-brand-black placeholder:text-brand-black/30 placeholder:font-light focus:outline-none transition-colors"
                autoFocus
              />
              <button 
                className="absolute right-0 hover:opacity-70 transition-opacity px-4 py-4"
                onClick={() => setSearchOpen(false)}
              >
                <X className="w-6 h-6 text-brand-black" strokeWidth={1.5} />
              </button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="max-w-[800px] mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.slice(0, 4).map((product) => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`} 
                    onClick={() => setSearchOpen(false)}
                    className="group"
                  >
                    <div className="aspect-[4/5] bg-brand-cream relative overflow-hidden mb-3">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105 ${product.images.length > 1 ? 'group-hover:opacity-0' : ''}`} />
                          {product.images.length > 1 && (
                            <img src={product.images[1]} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100" />
                          )}
                        </>
                      ) : (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                      )}
                    </div>
                    <h3 className="text-sm font-serif">{product.name}</h3>
                    <p className="text-[11px] text-brand-black/60">${product.price}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto mt-8 flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-medium uppercase tracking-widest text-[#555]">
                <span>Trending:</span>
                <a href="#" className="hover:text-brand-black transition-colors underline-offset-4 hover:underline">Santal</a>
                <a href="#" className="hover:text-brand-black transition-colors underline-offset-4 hover:underline">Gift Sets</a>
                <a href="#" className="hover:text-brand-black transition-colors underline-offset-4 hover:underline">Oud</a>
                <a href="#" className="hover:text-brand-black transition-colors underline-offset-4 hover:underline">Limited Edition</a>
              </div>
            )}
            
            {/* Overlay backdrop for search modal */}
            <div 
              className="fixed inset-0 top-[100%] bg-black/20 backdrop-blur-sm -z-10 h-screen"
              onClick={() => setSearchOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </header>

      {/* Cart Drawer Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-[400px] bg-brand-cream z-[110] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-brand-black/10">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-2xl tracking-wider text-brand-black">Your Cart</h2>
                  <span className="bg-brand-black text-brand-white text-xs px-2 py-1 min-w-[24px] text-center rounded-full font-medium">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </div>
                <button onClick={() => setCartOpen(false)} className="hover:bg-brand-black/5 p-2 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-black" strokeWidth={1} />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-brand-black/20 mb-6" strokeWidth={1} />
                  <p className="text-sm uppercase tracking-widest text-brand-black/60 mb-2">Your cart is empty</p>
                  <p className="text-[14px] text-[#555] font-light mb-8">Discover your next signature scent.</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover" />
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between mt-1">
                            <h3 className="font-serif text-lg text-brand-black">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-brand-black/50 hover:text-brand-black">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-auto">
                            {item.compareAtPrice ? (
                              <>
                                <span className="text-sm text-brand-black/40 line-through">${Number(item.compareAtPrice).toFixed(2)}</span>
                                <span className="text-sm text-red-700">${Number(item.price).toFixed(2)}</span>
                              </>
                            ) : (
                              <span className="text-sm text-brand-black/60">${Number(item.price).toFixed(2)}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-4 bg-brand-black/5 w-fit px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-brand-black/10 rounded">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-brand-black/10 rounded">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {cart.length > 3 && (
                      <div className="text-center text-sm font-medium text-brand-black/60 pt-4 pb-2 border-t border-brand-black/5">
                        +{cart.length - 3} more item{cart.length - 3 !== 1 ? 's' : ''} in cart
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 border-t border-brand-black/10 bg-brand-cream mt-auto">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-sm uppercase tracking-widest text-brand-black/70">Subtotal</span>
                      <span className="font-serif text-[28px] leading-none">${subtotal.toFixed(2)}</span>
                    </div>
                    <Link
                      to="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="group w-full flex items-center justify-center gap-4 bg-brand-black text-brand-white px-8 py-5 hover:bg-zinc-800 transition-colors"
                    >
                      <span className="text-[12px] uppercase tracking-[0.2em] font-medium">Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 right-0 w-[90%] max-w-[420px] bg-brand-black text-brand-white flex flex-col pt-20 px-10 border-l border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-8 h-8" strokeWidth={1} />
              </button>

              <div className="flex flex-col gap-6 mt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Menu</span>
                {links.map((link, i) => (
                  <motion.a
                    key={link}
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl sm:text-5xl font-serif text-white/80 hover:text-white transition-all transform hover:translate-x-2 block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-auto mb-16 flex flex-col gap-8">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/10 pb-4">Personal</span>
                  <div className="flex flex-col gap-6">
                    {user ? (
                      <Link to={user.role === 'admin' ? '/admin' : '/account'} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors group">
                        <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors"><User className="w-4 h-4"/></span> 
                        My Account
                      </Link>
                    ) : (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors group">
                        <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors"><User className="w-4 h-4"/></span> 
                        Sign In
                      </Link>
                    )}
                    <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors group">
                      <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                        <Heart className="w-4 h-4"/>
                      </span> 
                      Wishlist {wishlistCount > 0 && <span className="bg-white text-brand-black px-2 py-0.5 rounded-full text-[10px] font-bold">{wishlistCount}</span>}
                    </Link>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
