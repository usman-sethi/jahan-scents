import { useState } from "react";
import { Link } from "react-router-dom";

export function Marquee() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <style>{`
        @keyframes slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide {
          animation: slide 80s linear infinite;
        }
      `}</style>
      <div 
        className="bg-brand-black text-brand-taupe py-2.5 overflow-hidden flex whitespace-nowrap relative z-50 select-none cursor-default border-b border-brand-white/10"
      >
        <div
          className="flex items-center w-max animate-slide"
          style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
        >
          {/* First loop */}
          <div className="flex gap-16 pr-16 items-center">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={`first-${i}`} className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                Your Signature Scent – Now in 50ml. 
                <Link 
                  to="/collection/50ml" 
                  className="underline underline-offset-4 text-brand-white hover:text-brand-gold transition-colors cursor-pointer inline-block py-1 ml-1"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Discover
                </Link>
              </span>
            ))}
          </div>
          {/* Second loop (identical) */}
          <div className="flex gap-16 pr-16 items-center">
            {Array.from({ length: 15 }).map((_, i) => (
              <span key={`second-${i}`} className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                Your Signature Scent – Now in 50ml. 
                <Link 
                  to="/collection/50ml" 
                  className="underline underline-offset-4 text-brand-white hover:text-brand-gold transition-colors cursor-pointer inline-block py-1 ml-1"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Discover
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
