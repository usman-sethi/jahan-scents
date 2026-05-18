import { useEffect } from 'react';

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12">
      <h1 className="text-4xl font-serif text-brand-black mb-12 text-center">Terms and Conditions</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none">
        <p>Welcome to JAHAN!</p>
        <p>These terms and conditions outline the rules and regulations for the use of JAHAN's Website.</p>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use JAHAN if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <p>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">Cookies</h3>
        <p>
          We employ the use of cookies. By accessing JAHAN, you agreed to use cookies in agreement with JAHAN's Privacy Policy.
        </p>
        <p>
          Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">License</h3>
        <p>
          Unless otherwise stated, JAHAN and/or its licensors own the intellectual property rights for all material on JAHAN. All intellectual property rights are reserved. You may access this from JAHAN for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        
        <p>You must not:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4 mb-8">
          <li>Republish material from JAHAN</li>
          <li>Sell, rent or sub-license material from JAHAN</li>
          <li>Reproduce, duplicate or copy material from JAHAN</li>
          <li>Redistribute content from JAHAN</li>
        </ul>
      </div>
    </div>
  );
}
