import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the popup has already been shown in this session
    const hasSeenPopup = sessionStorage.getItem('jahan_popup_seen_new_2');
    const hasSubscribed = localStorage.getItem('jahan_newsletter_subscribed');

    if (!hasSeenPopup && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('jahan_popup_seen_new_2', 'true');
      }, 5000); // 5 seconds wait
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone) {
      setError('Please provide both email and phone number.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      });

      if (!res.ok) {
        let errStr = 'Failed to subscribe. Please try again later.';
        try {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            errStr = data.details || data.error || errStr;
          } catch(e) {
            errStr = `Invalid response: ${text.substring(0, 40)}`;
          }
        } catch(e) {}
        throw new Error(errStr);
      }

      setIsSuccess(true);
      localStorage.setItem('jahan_newsletter_subscribed', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-brand-cream w-full max-w-lg relative shadow-2xl overflow-hidden flex flex-col md:flex-row rounded-sm"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-brand-black/60 hover:text-brand-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full md:w-2/5 h-48 md:h-auto relative hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop" 
                alt="Jahan Perfumes" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center bg-brand-cream">
              {!isSuccess ? (
                <>
                  <h3 className="font-serif text-2xl tracking-wide mb-2 text-brand-black">Exclusive Updates</h3>
                  <p className="text-xs text-brand-black/60 mb-6 leading-relaxed">
                    Join the World of Jahan. Subscribe to receive exclusive access to new releases and private sales.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" 
                        className="w-full bg-transparent border-b border-brand-black/30 pb-2 px-1 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-black transition-colors disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number" 
                        className="w-full bg-transparent border-b border-brand-black/30 pb-2 px-1 text-sm text-brand-black placeholder:text-brand-black/40 focus:outline-none focus:border-brand-black transition-colors disabled:opacity-50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    {error && (
                      <p className="text-red-500 text-xs mt-1 bg-red-50 p-2 rounded-sm border border-red-100">{error}</p>
                    )}
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-2 bg-brand-black text-brand-white px-6 py-3 text-xs font-medium uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                    <p className="text-[10px] text-brand-black/40 text-center mt-2">
                       By subscribing you agree to our Terms of Service.
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <X className="w-6 h-6 hidden" /> {/* Hidden X to maintain import structure, or import Check if wanted */}
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="font-serif text-xl tracking-wide mb-2">Welcome to Jahan</h3>
                  <p className="text-xs text-brand-black/60">
                    You've been successfully added to our list.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
