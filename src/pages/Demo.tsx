import { useEffect } from 'react';

export default function Demo() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12 text-center">
      <h1 className="text-4xl font-serif text-brand-black mb-12">Coming Soon</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none mx-auto text-left max-w-[600px] bg-brand-cream p-12 border border-brand-black/10">
        <p className="text-center">
          We are currently working on curating this section. Please check back later for exciting new content, luxury pieces, and exclusive announcements from JAHAN.
        </p>
      </div>
    </div>
  );
}
