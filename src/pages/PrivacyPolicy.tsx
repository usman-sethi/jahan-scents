import { useEffect } from 'react';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12">
      <h1 className="text-4xl font-serif text-brand-black mb-12 text-center">Privacy Policy</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none">
        <p>
          JAHAN works to ensure that your privacy is protected when using our services. We, therefore, have a policy explaining what personal information is, how we use the information, who has access to the data, and your rights regarding the information collected. Your access and use of our website constitute your acceptance of our Privacy Policy and Terms of Use.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">Personal Data</h3>
        <p>
          We take responsibility for all the personal data (such as your name, address, email address, phone number, and date of birth) that you provide us with, obtained when you subscribe to our newsletter or when you create a personal profile.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">How do we use your Personal Data?</h3>
        <p>
          We use the information that we collect to fulfil our commitments to you and to provide you with the service that you expect. This includes sending you information and offers for marketing purposes. In order to provide you with relevant offers and information, we may analyse your personal data. We will only keep your data for as long as necessary to carry out our services to you or for as long as we are required by law. After this, your personal data will be deleted.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">What information does JAHAN share with third parties?</h3>
        <p>
          JAHAN may share your personal information with third parties or affiliates of JAHAN who perform services on our behalf or process authorized transactions. The personal information we share with these companies to perform services on our behalf is protected via contractual agreements and cannot be shared. We do not sell your information to any third party nor do we disclose your personal information to unaffiliated third parties.
        </p>

        <h3 className="text-lg font-medium text-brand-black mt-8 mb-4">What are your rights?</h3>
        <p>
          You have the right to request information about the personal data we hold on you. If your data is incorrect, incomplete, or irrelevant, you can ask to have the information corrected or removed.
        </p>
      </div>
    </div>
  );
}
