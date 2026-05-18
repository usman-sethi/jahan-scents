import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
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
      setEmail('');
      setPhone('');
      localStorage.setItem('jahan_newsletter_subscribed', 'true');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#E5E0D8]/40 py-40 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-[64px] tracking-tight font-serif mb-8 text-brand-black"
        >
          Join the World of Jahan
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-brand-black/60 mb-16 text-[15px] font-light max-w-md mx-auto leading-relaxed"
        >
          Subscribe to receive exclusive access to limited editions, private sales, and the latest from our perfumers.
        </motion.p>

        <div className="min-h-[80px] max-w-lg mx-auto mb-8 relative">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6 relative"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col sm:flex-row gap-4 relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full bg-transparent border-b border-brand-black/20 pb-4 px-2 text-brand-black placeholder:text-brand-black/40 text-[15px] font-light focus:outline-none focus:border-brand-black transition-colors rounded-none disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                  />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone (optional)" 
                    className="w-full bg-transparent border-b border-brand-black/20 pb-4 px-2 text-brand-black placeholder:text-brand-black/40 text-[15px] font-light focus:outline-none focus:border-brand-black transition-colors rounded-none disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                </div>
                {error && <p className="text-red-500 text-xs text-left px-2">{error}</p>}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="sm:absolute sm:right-0 sm:bottom-4 group flex justify-center items-center gap-3 text-brand-black text-[10px] font-medium uppercase tracking-[0.2em] hover:text-brand-gold transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center gap-4 py-8"
              >
                <p className="font-serif text-[28px] text-brand-black tracking-wide font-light">
                  Welcome to the World of Jahan.
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-brand-black/50">
                  Your journey begins now
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-[10px] uppercase tracking-[0.1em] text-brand-black/30 mt-16"
        >
          By subscribing, you agree to our <a href="#" className="underline underline-offset-4 hover:text-brand-black">Terms</a> and <a href="#" className="underline underline-offset-4 hover:text-brand-black">Privacy Policy</a>.
        </motion.p>
      </div>

    </section>
  );
}
