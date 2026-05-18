/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { motion } from 'motion/react';
import { AnimatedRoutes } from './components/AnimatedRoutes';

// Loading fallback component
const PageLoader = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    transition={{ duration: 0.8, ease: "easeInOut" }}
    className="min-h-screen flex items-center justify-center bg-brand-cream fixed inset-0 z-[100]"
  >
    <motion.div 
      animate={{ filter: ["blur(4px)", "blur(0px)", "blur(4px)"], opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      className="text-2xl font-serif tracking-[0.25em] text-brand-black uppercase"
    >
      JAHAN
    </motion.div>
  </motion.div>
);

export default function App() {
  return (
    <HelmetProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </HelmetProvider>
  );
}

