import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export function Footer() {
  const shopLinks = [
    { label: 'All Fragrances', href: '/demo' },
    { label: "Men's Collection", href: '/men' },
    { label: "Women's Collection", href: '/women' },
    { label: 'Gift Sets', href: '/bundles' },
    { label: 'E-Gift Cards', href: '/demo' },
    { label: 'Discovery Set', href: '/demo' }
  ];

  const aboutLinks = [
    { label: 'Our Story', href: '/about' },
    { label: 'Ingredients', href: '/demo' },
    { label: 'Stores', href: '/demo' },
    { label: 'Journal', href: '/demo' },
    { label: 'Careers', href: '/demo' },
    { label: 'Press', href: '/demo' }
  ];

  const supportLinks = [
    { label: 'FAQ', href: '/demo' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Exchanges & Returns', href: '/exchanges' },
    { label: 'Contact Us', href: '/contact' }
  ];

  return (
    <footer className="bg-brand-black text-brand-white pt-32 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 border-b border-brand-white/10 pb-24 mb-12">
          
          {/* Brand Info */}
          <div className="lg:pr-12">
            <Link to="/" className="inline-flex items-center gap-4 mb-8">
              <img src="/logo.svg" alt="JAHAN" className="h-10 w-auto object-contain invert grayscale mix-blend-screen opacity-90" />
              <span className="block font-serif text-[28px] tracking-[0.25em] font-light text-brand-white uppercase">JAHAN</span>
            </Link>
            <p className="text-brand-white/50 text-sm leading-loose mb-10 max-w-sm font-light">
              Crafting memories through scent. Independent luxury perfumery founded in Grasse, made for the modern individual.
            </p>
            <div className="flex gap-4 border-b border-brand-white/10 pb-10 mb-8 inline-block">
              <div className="flex gap-4">
                <a href="#" className="text-brand-white/50 hover:text-brand-white transition-colors">
                  <Instagram className="w-5 h-5" strokeWidth={1} />
                </a>
                <a href="#" className="text-brand-white/50 hover:text-brand-white transition-colors">
                  <TiktokIcon className="w-5 h-5" />
                </a>
                <a href="#" className="text-brand-white/50 hover:text-brand-white transition-colors">
                  <Youtube className="w-5 h-5" strokeWidth={1} />
                </a>
                <a href="#" className="text-brand-white/50 hover:text-brand-white transition-colors">
                  <Facebook className="w-5 h-5" strokeWidth={1} />
                </a>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase mb-8 text-brand-white/40">Shop</h3>
            <ul className="space-y-5">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-brand-white/70 hover:text-brand-white text-[13px] tracking-wide transition-colors relative group inline-block font-light">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-brand-white origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase mb-8 text-brand-white/40">About</h3>
            <ul className="space-y-5">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-brand-white/70 hover:text-brand-white text-[13px] tracking-wide transition-colors relative group inline-block font-light">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-brand-white origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase mb-8 text-brand-white/40">Support</h3>
            <ul className="space-y-5">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-brand-white/70 hover:text-brand-white text-[13px] tracking-wide transition-colors relative group inline-block font-light">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 w-full h-[1px] bg-brand-white origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-brand-white/40 font-light tracking-wide md:pb-8">
          <p>© {new Date().getFullYear()} JAHAN. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-brand-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-brand-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-brand-white transition-colors">Cookie settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
