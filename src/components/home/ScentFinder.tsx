import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const questions = [
  {
    id: 1,
    question: "What is your ideal escape?",
    options: ["A walk in the forest", "A sunset on the beach", "A bustling midnight city", "A quiet garden cafe"]
  },
  {
    id: 2,
    question: "How do you want to feel?",
    options: ["Mysterious & Alluring", "Fresh & Invigorated", "Warm & Embraced", "Elegant & Confident"]
  },
  {
    id: 3,
    question: "Which aroma draws you in?",
    options: ["Rich woods & spices", "Saltwater & citrus", "Vanilla & amber", "Blooming florals"]
  }
];

export function ScentFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [recommendedProduct, setRecommendedProduct] = useState<any>(null);
  const [cmsSettings, setCmsSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/cms')
      .then(res => res.json())
      .then(data => setCmsSettings(data))
      .catch(console.error);

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
        if(Array.isArray(data)) setDbProducts(data);
      })
      .catch(console.error);
  }, []);

  const handleNext = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Check if admin selected a specific product for the velvet experience
      if (cmsSettings?.velvetProductId) {
        const adminProduct = dbProducts.find(p => p._id === cmsSettings.velvetProductId);
        if (adminProduct) {
          setRecommendedProduct(adminProduct);
          setIsFinished(true);
          return;
        }
      }

      // Find a matching product
      let targetVibes: string[] = [];
      const escapeAnswer = newAnswers[0];
      if (escapeAnswer === "A walk in the forest") targetVibes = ["Woody", "Earthy"];
      if (escapeAnswer === "A bustling midnight city") targetVibes = ["Spicy", "Oriental"];
      if (escapeAnswer === "A sunset on the beach") targetVibes = ["Fresh", "Citrus", "Aquatic"];
      if (escapeAnswer === "A quiet garden cafe") targetVibes = ["Floral", "Gourmand"];
      
      let matched = dbProducts.find(p => p.categories && targetVibes.some(v => p.categories.includes(v)));
      if (!matched && dbProducts.length > 0) matched = dbProducts[0]; // fallback
      
      setRecommendedProduct(matched);
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setIsFinished(false);
  };

  return (
    <section id="scent-finder" className="py-24 bg-brand-black text-brand-white overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-brand-taupe block mb-4">The Velvet Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif">Find Your Signature Scent</h2>
        </motion.div>

        <div className="min-h-[300px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {!isFinished ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="mb-4 text-sm font-medium tracking-widest text-brand-taupe">
                  0{currentStep + 1} / 0{questions.length}
                </div>
                <h3 className="text-2xl md:text-3xl font-serif mb-10">{questions[currentStep]?.question}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {questions[currentStep]?.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleNext(option)}
                      className="group border border-brand-white/20 py-4 px-6 text-sm tracking-wider uppercase hover:border-brand-white hover:bg-brand-white hover:text-brand-black transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="relative z-10">{option}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl mx-auto bg-brand-white/5 p-8 md:p-14 border border-brand-white/10"
              >
                <div className="text-center mb-12">
                  <h3 className="text-4xl md:text-5xl font-serif mb-4 text-white font-light tracking-wide">We found your match.</h3>
                  <p className="text-brand-taupe/90 text-xs md:text-sm tracking-[0.2em] uppercase font-medium">Based on your refined preferences</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-left mb-10">
                  <div className="w-56 h-72 bg-brand-taupe/10 shrink-0 relative overflow-hidden border border-brand-white/5">
                    <img 
                      src={recommendedProduct?.images?.[0] || recommendedProduct?.image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"} 
                      alt={recommendedProduct?.name || "Recommended Perfume"} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 py-4 text-center md:text-left">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mb-3 block">Your Signature Scent</span>
                    <h4 className="text-3xl font-serif mb-3 text-white">{recommendedProduct?.name || "Santal Mystique"}</h4>
                    <p className="text-brand-white/60 text-sm mb-6 leading-relaxed line-clamp-3">
                      {recommendedProduct?.description || "Deep, intoxicating, and memorable. Woods and spices blended to perfection for evening wear."}
                    </p>
                    <p className="text-lg font-medium tracking-wider mb-8 text-white">Rs. {recommendedProduct?.price || "240"}</p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <Link 
                        to={`/product/${recommendedProduct?._id || recommendedProduct?.id || 'demo'}`}
                        className="px-8 py-3 bg-white text-brand-black text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-brand-taupe hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-brand-white/10 pt-6 mt-8">
                  <button 
                    onClick={handleReset}
                    className="text-xs uppercase tracking-widest text-brand-taupe hover:text-brand-white flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
