import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { Marquee } from '../components/layout/Marquee';
import { Navbar } from '../components/layout/Navbar';
import { Newsletter } from '../components/layout/Newsletter';
import { Footer } from '../components/layout/Footer';
import { NewsletterPopup } from '../components/layout/NewsletterPopup';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
// @ts-ignore
import Lenis from 'lenis';

export default function ClientLayout() {
  const [showFloatingTab, setShowFloatingTab] = useState(true);
  const location = useLocation();
  const currentOutlet = useOutlet();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-black selection:text-brand-white relative overflow-x-hidden">
      <Marquee />
      <Navbar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-grow flex flex-col"
        >
          {currentOutlet}
        </motion.main>
      </AnimatePresence>

      <Newsletter />
      <Footer />
      <NewsletterPopup />
      
      {/* Floating Scent Finder Tab */}
      <AnimatePresence>
        {showFloatingTab && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-[100px] right-0 z-40 shadow-[0_10px_20px_rgba(0,0,0,0.1)] rounded-l-full bg-brand-black flex items-center"
          >
            <button 
              onClick={() => setShowFloatingTab(false)} 
              className="pl-4 pr-3 py-3 text-brand-white/50 hover:text-brand-white transition-colors flex items-center"
              aria-label="Close tab"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-4 bg-brand-white/20"></div>
            <a href="#scent-finder" className="text-brand-white py-3 pl-4 pr-6 text-[11px] uppercase tracking-[0.1em] hover:pr-8 transition-all duration-300 flex items-center gap-2">
              Find Your Signature Scent <span>&rarr;</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
