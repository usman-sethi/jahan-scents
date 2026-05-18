import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const testimonials = [
  {
    id: 1,
    name: "Eleanor V.",
    text: "Santal Mystique is an absolute revelation. I've never received so many compliments. It wears beautifully throughout the day and leaves the most elegant trail.",
    product: "Santal Mystique"
  },
  {
    id: 2,
    name: "James T.",
    text: "The presentation alone is worth the price. But the fragrance... Noir Absolu has become my signature scent. Bold, uncompromising, yet incredibly sophisticated.",
    product: "Noir Absolu"
  },
  {
    id: 3,
    name: "Sophia L.",
    text: "I was hesitant to buy perfume online, but Bergamot Blanc is exactly as described. Fresh, airy, and undeniably luxurious. Excellent customer service as well.",
    product: "Bergamot Blanc"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-brand-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <div className="flex justify-center gap-1 mb-10 text-brand-gold">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 fill-current" />
          ))}
        </div>

        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-full"
            >
              <h3 className="text-2xl md:text-4xl lg:text-[40px] font-serif font-light leading-[1.4] mb-12 text-brand-black tracking-tight">
                "{testimonials[currentIndex].text}"
              </h3>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-brand-black">{testimonials[currentIndex].name}</span>
                <span className="text-[10px] text-brand-black/50 tracking-[0.1em] uppercase">Verified Buyer • {testimonials[currentIndex].product}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-8 mt-12">
          <button 
            onClick={prev}
            className="w-10 h-10 border border-brand-black/10 rounded-full flex items-center justify-center hover:border-brand-black transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2 items-center">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex ? "bg-brand-black w-3" : "bg-brand-black/20"
                )}
              />
            ))}
          </div>
          <button 
            onClick={next}
            className="w-10 h-10 border border-brand-black/10 rounded-full flex items-center justify-center hover:border-brand-black transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
