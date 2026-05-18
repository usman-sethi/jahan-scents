import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [cms, setCms] = useState<any>({});
  
  useEffect(() => {
    fetch('/api/cms').then(res => res.json()).then(data => setCms(data)).catch(console.error);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] md:min-h-screen flex items-center bg-brand-cream overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.img 
          style={{ y, opacity }}
          src={cms.heroImage || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1600&auto=format&fit=crop"}
          alt="Luxury Perfume" 
          fetchPriority="high"
          rel="preload"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/90 via-brand-cream/60 to-brand-cream/80" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-20 relative z-20 h-full flex flex-col justify-center items-center text-center mt-24">
        <div className="max-w-[800px] flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[11px] uppercase tracking-[0.3em] font-sans font-medium text-brand-gold mb-8"
          >
            {cms.heroTitle || "L'Essence de l'Élégance"}
          </motion.span>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-[84px] font-serif mb-8 leading-[1.05] font-light text-brand-black tracking-tight"
          >
            {cms.heroSubtitle ? cms.heroSubtitle.split('For').map((line: string, i: number) => i === 0 ? <span key={i}>{line}For<br/></span> : <span key={i}>{line}</span>) : <>Crafted Scents For<br /> Timeless Presence</>}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="text-lg md:text-[20px] leading-[1.6] text-brand-black/70 mb-12 font-light max-w-[500px]"
          >
            {cms.featuredText || "Every fragrance tells a story. Crafted with precision and inspired by timeless elegance."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <a
              href="#shop"
              className="group relative overflow-hidden px-12 py-4 bg-brand-black text-brand-white text-[12px] uppercase tracking-[0.15em] w-full sm:w-auto text-center border border-brand-black transition-all duration-500 hover:text-brand-black"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-brand-white transform scale-x-0 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-x-100 z-0"></div>
            </a>
            
            <a
              href="#explore"
              className="group relative overflow-hidden px-12 py-4 bg-transparent text-brand-black border border-brand-black/30 text-[12px] uppercase tracking-[0.15em] w-full sm:w-auto text-center transition-all duration-500 hover:border-brand-black hover:text-brand-white"
            >
              <span className="relative z-10 transition-colors duration-500">Discover Fragrances</span>
              <div className="absolute inset-0 bg-brand-black transform scale-x-0 origin-left transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-x-100 z-0"></div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

