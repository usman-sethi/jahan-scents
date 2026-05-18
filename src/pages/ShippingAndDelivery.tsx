import { useEffect } from 'react';

export default function ShippingAndDelivery() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12">
      <h1 className="text-4xl font-serif text-brand-black mb-12 text-center">Shipping & Delivery</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none">
        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">Shipping</h3>
        <p>
          We deliver within Pakistan. Delivery times will depend on your location and availability of stock.
        </p>
        <p>
          Standard delivery charges of Rs. 199 within Pakistan.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">Delivery Considerations</h3>
        <p>
          While we partner with reliable courier companies, please be aware that unforeseen circumstances might lead to additional delivery charges or even undelivered packages. While we strive for smooth deliveries, we cannot guarantee full responsibility for potential issues caused by the courier company, such as unexpected charges or service interruptions.
        </p>

        <p className="mt-8">
          For further assistance, you can contact our customer service department by emailing us at <a href="mailto:support@jahanperfumes.com" className="text-brand-black hover:underline underline-offset-4">support@jahanperfumes.com</a>.
        </p>
      </div>
    </div>
  );
}
