import { useEffect } from 'react';

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12 text-center">
      <h1 className="text-4xl font-serif text-brand-black mb-12">Contact Us</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none mx-auto text-left max-w-[600px]">
        <p className="text-center mb-8">
          We love to hear from you! Whether you have questions, feedback or need assistance. Our team is here to help.
        </p>

        <div className="bg-brand-cream/50 p-8 border border-brand-black/10 text-center">
          <h3 className="text-lg font-serif text-brand-black mb-6">Customer Service</h3>
          
          <ul className="list-none p-0 space-y-4 mb-8">
            <li><strong>Email:</strong> support@jahanperfumes.com</li>
            <li><strong>Call/WhatsApp:</strong> 0300-1305-JAHAN</li>
            <li><strong>Address:</strong> Phase-6, DHA Raya, Lahore.</li>
            <li><strong>Hours:</strong> Monday - Friday: 9:00 AM - 5:00 PM</li>
          </ul>

          <p className="text-sm italic text-brand-black/60">
            We typically respond within 24 hours. We appreciate your patience and understanding!
          </p>
        </div>

        <div className="text-center mt-12">
          <p className="mb-4">Stay connected and follow us on our social media channels for the latest updates and promotions:</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="uppercase tracking-[0.1em] text-xs font-semibold hover:opacity-70 transition-opacity">Instagram</a>
            <a href="#" className="uppercase tracking-[0.1em] text-xs font-semibold hover:opacity-70 transition-opacity">Facebook</a>
          </div>
          <p className="mt-8 font-serif text-lg">We value your feedback!</p>
        </div>
      </div>
    </div>
  );
}
