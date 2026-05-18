import React, { useState, useEffect } from 'react';
import { Heart, Star, ChevronRight, Share2, Info, Wind, Droplet, PenTool } from 'lucide-react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { CloudinaryUpload } from '../components/admin/CloudinaryUpload';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [isWishlist, setIsWishlist] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [reviews, setReviews] = useState<any[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewEmail, setNewReviewEmail] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewImages, setNewReviewImages] = useState<string[]>([]);
  const [newReviewGender, setNewReviewGender] = useState('Female');
  const [newReviewAgeGroup, setNewReviewAgeGroup] = useState('18-24');
  const [newReviewVerdict, setNewReviewVerdict] = useState('Good');
  const [newReviewLongevity, setNewReviewLongevity] = useState('2-5 hours');

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating.");
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating: reviewRating, comment: newReviewComment, name: newReviewName, images: newReviewImages, verdict: newReviewVerdict, longevity: newReviewLongevity, gender: newReviewGender, ageGroup: newReviewAgeGroup })
      });
      if (res.ok) {
        const newReview = {
          id: Date.now(),
          name: newReviewName,
          rating: reviewRating,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          comment: newReviewComment,
          images: newReviewImages,
          verdict: newReviewVerdict,
          longevity: newReviewLongevity,
          gender: newReviewGender,
          ageGroup: newReviewAgeGroup
        };
        setReviews([newReview as any, ...reviews]);
        setIsReviewOpen(false);
        setReviewRating(0);
        setHoverRating(0);
        setNewReviewName('');
        setNewReviewComment('');
        setNewReviewImages([]);
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when page changes
    if (id && !['1', '2', '3', '4'].includes(id)) { // Check if it's external ID vs hardcoded mockup IDs
      fetch(`/api/products/${id}`)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then((data: any) => {
          if (!data.error) setProductData(data);
        })
        .catch(console.error);
        
      fetch(`/api/products/${id}/reviews`)
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setReviews(data);
          }
        })
        .catch(console.error);
        
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            const inWishlist = data.some(item => String(item.productId) === String(id));
            setIsWishlist(inWishlist);
          }
        })
        .catch(console.error);
      }
    }
  }, [id]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error', err);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const getPrice = () => {
    if (productData?.sizes && productData.sizes.length > 0) {
      const sizeObj = productData.sizes.find((s: any) => s.size === selectedSize) || productData.sizes[0];
      return { 
        current: Number(sizeObj.price).toFixed(2), 
        original: sizeObj.compareAtPrice ? Number(sizeObj.compareAtPrice).toFixed(2) : null
      };
    } else if (productData) {
       return { 
         current: Number(productData.price).toFixed(2), 
         original: productData.compareAtPrice ? Number(productData.compareAtPrice).toFixed(2) : null 
       };
    }
    // skeleton while loading
    return { current: '0.00', original: null };
  };
  const price = getPrice();

  useEffect(() => {
    if (productData?.sizes && productData.sizes.length > 0) {
      setSelectedSize(productData.sizes[0].size);
    } else if (productData?.size) {
      setSelectedSize(productData.size);
    }
  }, [productData]);

  return (
    <>
      <Helmet>
        <title>{productData ? `${productData.name} | JAHAN` : 'Product Details | JAHAN'}</title>
        <meta name="description" content={productData ? productData.description : 'Discover our exquisite luxury fragrances. Find your signature scent.'} />
      </Helmet>
      <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left: Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {productData?.images && productData.images.length > 0 ? (
            <>
              <motion.div 
                layoutId={`product-image-${productData?._id || 'fallback'}`}
                className="aspect-[4/5] bg-brand-cream relative overflow-hidden group cursor-zoom-in" 
                onClick={() => setZoomedImage(productData.images[0])}
              >
                 <motion.img 
                   initial={{ scale: 1.1 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   src={productData.images[0]}
                   alt={productData.name}
                   className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </motion.div>
              {productData.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {productData.images.slice(1).map((img: string, idx: number) => (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        key={idx} 
                        className="aspect-[4/5] bg-brand-cream relative overflow-hidden group cursor-zoom-in" 
                        onClick={() => setZoomedImage(img)}
                     >
                        <motion.img 
                         src={img}
                         alt={`${productData.name} detail ${idx + 1}`}
                         className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                       />
                     </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <motion.div 
                layoutId={`product-image-${productData?._id || 'fallback'}`}
                className="aspect-[4/5] bg-brand-cream relative overflow-hidden group cursor-zoom-in" 
                onClick={() => setZoomedImage(productData?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop")}
              >
                 <motion.img 
                   initial={{ scale: 1.1 }}
                   animate={{ scale: 1 }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   src={productData?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"}
                   alt={productData?.name || "JAF Classic Gift set"}
                   className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                 />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-brand-black/50 mb-8">
            <Link to="/" className="hover:text-brand-black transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="#" className="hover:text-brand-black transition-colors">Gift Sets</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand-black">{productData?.name || "JAF Classic"}</span>
          </div>

          <h1 className="text-4xl lg:text-[56px] font-serif font-light text-brand-black mb-6 leading-[1.05] tracking-tight">
            {productData?.name || "JAF Classic Gift set"}
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-brand-gold">
              {[...Array(5)].map((_, index) => {
                const avgRating = reviews.length > 0 ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length : 0;
                return (
                 <Star key={index} className={`w-4 h-4 ${index < Math.round(avgRating) ? 'fill-current' : 'text-gray-300'}`} />
                );
              })}
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-black/60 font-medium">{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-end gap-3 mb-10">
            {price.original ? (
              <>
                <span className="text-[24px] tracking-wide text-brand-black font-medium">${price.current}</span>
                <span className="text-[14px] uppercase tracking-widest text-brand-black/40 line-through pb-1 pl-2">${price.original}</span>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-medium border border-brand-gold px-2 py-0.5 ml-2 rounded-sm pb-1 mb-[2px]">Sale</span>
              </>
            ) : (
              <span className="text-[24px] tracking-wide text-brand-black font-medium">${price.current}</span>
            )}
          </div>

         <div className="prose prose-sm text-brand-black/70 font-light leading-[1.8] mb-12">
            <p className="text-[15px]">
              This JAF 100ml + 10ml set is perfect for those who love keeping their favorite fragrance close—carry the 10ml in your bag for touch-ups while the 100ml stays at home.
              {isDescriptionExpanded && (
                <span>
                  <br /><br />
                  Crafted using the finest ingredients, this set offers a long-lasting, memorable scent profile. Ideal for personal use or as a luxurious gift. The sleek bottle design ensures it stands out on any vanity.
                </span>
              )}
            </p>
            <button 
              className="text-[11px] uppercase tracking-[0.1em] text-brand-black underline underline-offset-4 mt-2 hover:opacity-70 transition-opacity"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? 'Read less' : 'Read more'}
            </button>
          </div>

          <div className="mb-10">
            {productData?.sizes && productData.sizes.length > 0 ? (
              <>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-black font-semibold mb-4 block">Size: {selectedSize}</span>
                <div className="flex flex-wrap gap-4">
                   {productData.sizes.map((s: any) => (
                     <button 
                       key={s.size}
                       onClick={() => setSelectedSize(s.size)}
                       className={`px-8 py-3 text-[11px] uppercase tracking-[0.1em] border transition-colors ${selectedSize === s.size ? 'border-brand-black bg-brand-black text-brand-white' : 'border-brand-black/20 text-brand-black hover:border-brand-black'}`}
                     >
                       {s.size}
                     </button>
                   ))}
                </div>
              </>
            ) : productData?.size ? (
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-black font-semibold mb-4 block">Size: {productData.size}</span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            <div className="flex items-center border border-brand-black/20 h-14 shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-full flex items-center justify-center text-brand-black hover:bg-brand-cream transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-[13px] font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-full flex items-center justify-center text-brand-black hover:bg-brand-cream transition-colors"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => {
                const name = productData?.name || "JAF Classic Gift set";
                addToCart({
                  id: productData?._id || "jaf-classic",
                  name: `${name}${selectedSize ? ` - ${selectedSize}` : ''}`,
                  price: parseFloat(price.current.replace(/,/g, '')),
                  compareAtPrice: price.original ? parseFloat(price.original.replace(/,/g, '')) : undefined,
                  image: productData?.images?.[0] || productData?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
                  quantity
                });
              }}
              className="flex-1 basis-[200px] bg-brand-black text-brand-white py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors text-center"
            >
              Add to Cart
            </button>
            <button 
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                  navigate('/login', { state: { from: location.pathname } });
                  return;
                }
                try {
                  const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                      productId: productData?._id || id || "jaf-classic",
                      name: productData?.name || "JAF Classic Gift set",
                      price: parseFloat(price.current.replace(/,/g, '')),
                      image: productData?.images?.[0] || productData?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
                    })
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setIsWishlist(data.state);
                    window.dispatchEvent(new CustomEvent('wishlist-updated'));
                    setToastMessage(data.message);
                    setTimeout(() => setToastMessage(null), 3000);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              className={`w-14 h-14 border flex items-center justify-center transition-colors shrink-0 ${isWishlist ? 'border-brand-black/50 text-red-500' : 'border-brand-black/20 text-brand-black hover:border-brand-black'}`}
            >
              <Heart className="w-5 h-5" strokeWidth={1} fill={isWishlist ? "currentColor" : "none"} />
            </button>
             <button 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    setToastMessage("Link copied to clipboard!");
                    setTimeout(() => setToastMessage(null), 3000);
                  } catch (err) {
                    console.error("Failed to copy link", err);
                  }
                }}
                className="w-14 h-14 border border-brand-black/20 flex items-center justify-center hover:border-brand-black transition-colors shrink-0"
             >
              <Share2 className="w-5 h-5 text-brand-black" strokeWidth={1} />
            </button>
          </div>

          <div className="border-t border-brand-black/10 pt-8 space-y-6">
             <details className="group" open>
               <summary className="flex justify-between items-center font-serif text-[18px] cursor-pointer list-none text-brand-black">
                 Fragrance Notes
                 <span className="transition group-open:rotate-180">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
                 </span>
               </summary>
               <div className="text-[14px] text-[#555] font-light pt-4 leading-relaxed">
                 Top: Calabrian Bergamot, Pink Pepper<br/>
                 Heart: Iris, Rose Centifolia<br/>
                 Base: Sandalwood, Vanilla, White Musks
               </div>
             </details>
             
             <details className="group border-t border-brand-black/10 pt-6">
               <summary className="flex justify-between items-center font-serif text-[18px] cursor-pointer list-none text-brand-black">
                 Shipping & Returns
                 <span className="transition group-open:rotate-180">
                    <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg>
                 </span>
               </summary>
               <div className="text-[14px] text-[#555] font-light pt-4 leading-relaxed">
                 Complimentary shipping on all orders. Returns are accepted within 14 days of delivery provided the item is unopened and in its original packaging.
               </div>
             </details>
          </div>
        </motion.div>

      </div>

      {/* Cinematic Story Sections */}
      <div className="mt-32 mb-24 max-w-full">
        {/* Fragrance Story */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] md:h-[700px] w-full flex items-center justify-center overflow-hidden mb-8"
        >
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1600&auto=format&fit=crop" alt="Fragrance Story" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-brand-black/60" />
          </div>
          <div className="relative z-10 max-w-3xl px-6 text-center text-brand-white">
            <h2 className="text-[12px] uppercase tracking-[0.3em] text-brand-gold mb-6 inline-flex items-center gap-2">
              <span className="w-8 h-px bg-brand-gold" /> The Story <span className="w-8 h-px bg-brand-gold" />
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-light mb-8 leading-tight">An Ode to Timeless Elegance</h3>
            <p className="text-lg md:text-xl font-light text-brand-white/80 leading-relaxed">
              Every drop captures the essence of a fleeting moment. Crafted with meticulous attention to detail, this fragrance is a journey through memory and emotion, designed to linger long after the wearer has departed.
            </p>
          </div>
        </motion.div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 lg:px-12 max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex border py-16 px-10 border-brand-black/10 flex-col items-center text-center group hover:bg-brand-black hover:text-brand-white transition-colors duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-brand-black/20 group-hover:border-white/20 flex items-center justify-center mb-8 transition-colors duration-500">
              <Wind className="w-6 h-6 shrink-0" strokeWidth={1} />
            </div>
            <h4 className="text-xl font-serif mb-4">Rare Ingredients</h4>
            <p className="text-sm font-light text-[#555] group-hover:text-brand-white/70 leading-relaxed transition-colors duration-500">
              Sourced from the most exclusive regions. Hand-picked Jasmine from Grasse meets exotic Madagascar Vanilla, creating a symphony of pure, unadulterated essence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex border py-16 px-10 border-brand-black/10 flex-col items-center text-center group hover:bg-brand-black hover:text-brand-white transition-colors duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-brand-black/20 group-hover:border-white/20 flex items-center justify-center mb-8 transition-colors duration-500">
              <Droplet className="w-6 h-6 shrink-0" strokeWidth={1} />
            </div>
            <h4 className="text-xl font-serif mb-4">Art of Application</h4>
            <p className="text-sm font-light text-[#555] group-hover:text-brand-white/70 leading-relaxed transition-colors duration-500">
              For a long-lasting trail, master the pulse points. Apply gently behind ears, inside wrists, and the base of the throat where skin emits the most warmth.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex border py-16 px-10 border-brand-black/10 flex-col items-center text-center group hover:bg-brand-black hover:text-brand-white transition-colors duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-brand-black/20 group-hover:border-white/20 flex items-center justify-center mb-8 transition-colors duration-500">
              <PenTool className="w-6 h-6 shrink-0" strokeWidth={1} />
            </div>
            <h4 className="text-xl font-serif mb-4">Master Perfumer</h4>
            <p className="text-sm font-light text-[#555] group-hover:text-brand-white/70 leading-relaxed transition-colors duration-500">
              "A perfume must be at once a veil and a revelation." Conceived by a master nose, the composition strikes a delicate balance between classic structure and modern daring.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-24 border-t border-brand-black/10 pt-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="group relative inline-block">
             <div className="flex items-center gap-4 cursor-pointer">
               <h3 className="text-3xl font-serif text-brand-black">Customer Reviews</h3>
               <div className="flex items-center gap-2">
                 <span className="text-[24px] font-serif">4.7</span>
                 <div className="flex text-brand-gold">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : i === 4 ? 'fill-current opacity-50' : 'text-gray-300'}`} />
                   ))}
                  </div>
               </div>
             </div>
             <p className="text-[12px] text-[#555] uppercase tracking-widest mt-2 block">Based on {42 + reviews.length} Reviews</p>

             <div className="absolute left-0 top-full mt-4 w-[280px] md:w-[360px] bg-white border border-brand-black/10 shadow-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                {[
                  { stars: 5, pct: 85, count: 38 },
                  { stars: 4, pct: 10, count: 5 },
                  { stars: 3, pct: 5, count: 1 },
                  { stars: 2, pct: 0, count: 0 },
                  { stars: 1, pct: 0, count: 0 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3 mb-3 text-[11px] uppercase tracking-widest text-[#555] font-medium last:mb-0">
                    <span className="w-[80px]">{row.stars} stars</span>
                    <div className="flex-1 h-1.5 bg-brand-cream overflow-hidden">
                      <div className="h-full bg-brand-gold" style={{ width: `${row.pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right">{row.count}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-center px-4 md:px-8 py-4 border border-brand-black/10 bg-brand-cream/50 min-w-[140px]">
               <span className="block text-2xl font-serif text-brand-black mb-1">90%</span>
               <span className="text-[10px] uppercase tracking-widest font-medium text-[#555]">Recommended</span>
             </div>
             <button 
               onClick={() => {
                 if (!user) {
                   navigate('/login', { state: { from: location.pathname } });
                   return;
                 }
                 document.getElementById('write-review')?.scrollIntoView({ behavior: 'smooth' });
                 setIsReviewOpen(true);
               }}
               className="border border-brand-black bg-brand-black text-brand-white px-6 md:px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-colors h-[82px] whitespace-nowrap"
             >
               {user ? 'Write a Review' : 'Login to Review'}
             </button>
          </div>
        </div>

        {reviews.flatMap(r => r.images || []).length > 0 && (
          <div className="mb-16">
            <h4 className="text-[11px] uppercase tracking-widest text-brand-black font-medium mb-6">Photos from reviews</h4>
            <div className="flex gap-4 overflow-x-auto snap-x pb-4">
              {reviews.flatMap(r => r.images || []).map((img, i) => (
                <div key={i} className="w-[160px] h-[160px] shrink-0 snap-start bg-brand-cream">
                  <img src={img} alt={`Review photo ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {isReviewOpen && (
          <div id="write-review" className="py-8 border-y border-brand-black/10 mb-12 animate-in fade-in slide-in-from-top-4">
            <h4 className="font-serif text-[24px] mb-8">Write a Review</h4>
            <form onSubmit={submitReview} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-3">Rating</label>
                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className={`transition-colors ${(hoverRating || reviewRating) >= star ? 'text-brand-gold' : 'text-gray-300'}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Review</label>
                <textarea required rows={4} value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} className="w-full border border-brand-black/20 p-4 text-sm focus:outline-none focus:border-brand-black transition-colors resize-none" placeholder="Share your thoughts about this fragrance..." />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Upload Photo (Optional)</label>
                {newReviewImages.length < 5 && (
                  <CloudinaryUpload 
                    onUpload={(url) => setNewReviewImages(prev => [...prev, url].slice(0, 5))}
                    label="Select Image"
                  />
                )}
                {newReviewImages.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-auto pb-2 items-end">
                    {newReviewImages.map((src, i) => (
                      <div key={i} className="relative shrink-0">
                        <img src={src} alt="Upload preview" className="w-16 h-16 object-cover border border-brand-black/10" />
                        <button 
                          type="button"
                          onClick={() => setNewReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-2 -right-2 bg-brand-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Name</label>
                  <input required type="text" value={newReviewName} onChange={(e) => setNewReviewName(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Email</label>
                  <input required type="email" value={newReviewEmail} onChange={(e) => setNewReviewEmail(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Verdict</label>
                  <select value={newReviewVerdict} onChange={(e) => setNewReviewVerdict(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm">
                    <option value="Good">Good</option>
                    <option value="Best">Best</option>
                    <option value="Bad">Bad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">How long does the fragrance last? *</label>
                  <select value={newReviewLongevity} onChange={(e) => setNewReviewLongevity(e.target.value)} required className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm">
                    <option value="2-5 hours">2-5 hours</option>
                    <option value="5-8 hours">5-8 hours</option>
                    <option value="8+ hours">8+ hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Gender</label>
                  <select value={newReviewGender} onChange={(e) => setNewReviewGender(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm">
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#555] mb-2">Age Group</label>
                  <select value={newReviewAgeGroup} onChange={(e) => setNewReviewAgeGroup(e.target.value)} className="w-full border-b border-brand-black/30 pb-2 focus:outline-none focus:border-brand-black transition-colors bg-transparent text-sm">
                    <option value="18-24">18-24</option>
                    <option value="25-34">25-34</option>
                    <option value="35-44">35-44</option>
                    <option value="45-54">45-54</option>
                    <option value="55+">55+</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                  Submit Review
                </button>
                <button type="button" onClick={() => setIsReviewOpen(false)} className="px-8 py-4 text-[11px] uppercase tracking-widest border border-brand-black/20 hover:border-brand-black transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-12 mb-16 max-w-4xl">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-brand-black/10 pb-8 last:border-0 last:pb-0 flex flex-col md:flex-row gap-8">
              {/* Left Column */}
              <div className="w-full md:w-1/4 shrink-0">
                <h5 className="text-[16px] font-medium text-brand-black mb-1">{review.name}</h5>
                {review.gender && (
                  <p className="text-[13px] text-[#555] mb-0.5">{review.gender}</p>
                )}
                {review.ageGroup && (
                  <p className="text-[13px] text-[#555]">{review.ageGroup}</p>
                )}
              </div>
              
              {/* Right Column */}
              <div className="w-full md:w-3/4 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-brand-gold mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    {review.verdict && (
                      <span className="text-[12px] font-medium uppercase tracking-widest text-brand-black/70 mb-1 block">
                        Verdict: {review.verdict}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] uppercase tracking-widest text-[#999]">{review.date}</span>
                </div>
                <p className="text-[15px] text-[#555] font-light leading-relaxed mb-4">{review.comment}</p>
                {review.longevity && (
                  <div className="mb-6">
                    <span className="text-[11px] uppercase tracking-widest text-brand-black/50 block mb-1">How long does the fragrance last?</span>
                    <span className="text-[13px] text-brand-black">{review.longevity}</span>
                  </div>
                )}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-4">
                    {review.images.map((img: string, i: number) => (
                      <div key={i} onClick={() => setZoomedImage(img)} className="w-[100px] h-[100px] bg-brand-cream overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity">
                        <img src={img} alt="User review photo" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-cream/95 cursor-zoom-out p-4 md:p-8 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setZoomedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-brand-black hover:opacity-70 z-[101] text-sm tracking-widest uppercase font-medium bg-brand-white/50 backdrop-blur-md px-4 py-2"
            onClick={() => setZoomedImage(null)}
          >
            Close (Esc)
          </button>
          <img 
            src={zoomedImage} 
            alt="Zoomed product" 
            className="max-w-full max-h-full object-contain shadow-2xl cursor-default animate-in fade-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-brand-black text-brand-white px-6 py-3 text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8">
          {toastMessage.includes("Wishlist") ? <Heart className="w-4 h-4 fill-current text-white" /> : <Share2 className="w-4 h-4 text-white" />}
          {toastMessage}
        </div>
      )}
    </div>
    </>
  );
}
