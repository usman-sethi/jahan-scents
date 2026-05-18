import { useEffect } from 'react';

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[1200px] mx-auto px-6 lg:px-12">
      <h1 className="text-4xl lg:text-[48px] font-serif text-brand-black mb-16 text-center leading-tight">
        The Essence of JAHAN
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
        <div className="aspect-[4/5] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" 
            alt="Our heritage" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>
        <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8]">
          <h2 className="text-3xl font-serif text-brand-black mb-6">Our Heritage</h2>
          <p>
            At JAHAN, we believe that a fragrance is more than just a scent; it is an invisible accessory, a lingering memory, and a profound statement of individuality. Born from a passion for the artistry of perfumery, our brand is dedicated to curating collections that evoke emotion and transcend time.
          </p>
          <p>
            Each bottle is a testament to our commitment to quality, blending rare ingredients sourced from around the world to create distinct, harmonious compositions. We invite you to discover the essence that resonates with your unique spirit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center flex-col-reverse md:flex-row">
        <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] order-2 md:order-1">
          <h2 className="text-3xl font-serif text-brand-black mb-6">The Craftsmanship</h2>
          <p>
            Craftsmanship lies at the heart of everything we do. From the delicate balance of top notes to the enduring resonance of the base, our master perfumers meticulously refine every formula until it achieves perfection.
          </p>
          <p>
            We take pride in our sustainable practices and ethical sourcing, ensuring that the beauty of our fragrances never comes at the expense of our planet. JAHAN is a celebration of nature's finest elements, elegantly bottled for the modern connoisseur.
          </p>
        </div>
        <div className="aspect-[4/5] overflow-hidden order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop" 
            alt="The craftsmanship" 
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
