import { useEffect } from 'react';

export default function ExchangesAndReturns() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 max-w-[800px] mx-auto px-6 lg:px-12">
      <h1 className="text-4xl font-serif text-brand-black mb-12 text-center">Exchanges, Returns & Cancellations</h1>
      
      <div className="prose prose-sm md:prose-base text-[#555] font-light leading-[1.8] max-w-none">
        <p className="mb-8 text-center text-lg font-serif">
          Thank you for choosing to shop with us! We have recently updated our policies to provide you with an enhanced shopping experience. Please review our policies below:
        </p>

        <div className="space-y-6">
          <div>
            <strong className="text-brand-black font-medium">Eligibility:</strong> Customers must contact our customer service center to request an exchange or return within 48 hours of receiving their order. Requests submitted after this period may not be accepted. To be eligible for an exchange, the item must be unused, undamaged, and in its original packaging with all tags and labels attached.
          </div>

          <div>
            <strong className="text-brand-black font-medium">Exchange Process:</strong> To initiate an exchange, please contact our customer service team through our official Facebook or Instagram inbox at <em>jahanperfumes</em> between 9:00 AM till 5:00 PM, Monday to Friday. You may also email images of any defective products to <a href="mailto:support@jahanperfumes.com" className="text-brand-black underline underline-offset-4">support@jahanperfumes.com</a>. You will receive response within 24 hours.
          </div>
          
          <p>
            Once your complaint is registered, it will be resolved within a maximum of 3 working days. However, we will make every effort to address and resolve your issue as quickly as possible.
          </p>
          
          <p className="italic font-medium text-brand-black">
            Please note that we don't offer cash refunds, only online store vouchers are available.
          </p>

          <div>
            <strong className="text-brand-black font-medium">Exchange Shipping:</strong> Customers are responsible for the shipping costs associated with returning the original item and receiving the exchanged item, unless the exchange is due to an error on our part (e.g., wrong item shipped, damaged item).
          </div>

          <div>
            <strong className="text-brand-black font-medium">Exchange Availability:</strong> Exchanges are dependent on product availability. In the event that the requested exchange item is unavailable, you may choose to select an alternative item from our existing stock or we will provide you with an online coupon equivalent to the value of the returned item, which can be utilized for a future purchase.
          </div>

          <div>
            <strong className="text-brand-black font-medium">No Returns for Change of Mind:</strong> We no longer accept returns for change of mind or if a customer doesn't like the product. We encourage you to carefully consider your purchase before completing the transaction.
          </div>

          <div>
            <strong className="text-brand-black font-medium">Damaged or Compromised Quality:</strong> If you receive a damaged or defective item, or if the quality of the product is compromised, please contact our customer service team immediately. We will investigate the issue and, if verified, issue an online coupon for the value of the damaged item that can be used towards a future purchase.
          </div>

          <div>
            <strong className="text-brand-black font-medium text-lg block border-b border-brand-black/10 pb-2 mb-4 mt-8">Exceptions and Conditions</strong>
            <p><strong className="text-brand-black font-medium">Non-Exchangeable Items:</strong> Items purchased from clearance or sale categories may not be eligible for exchanges.</p>
            <p className="mt-4"><strong className="text-brand-black font-medium">Proof of Purchase:</strong> A valid proof of purchase, such as an order confirmation or receipt, is required for all exchanges.</p>
            <p className="mt-4"><strong className="text-brand-black font-medium">Orders Placed Before Sales Campaigns:</strong> Please note that orders placed before the start of any promotional sale campaign will not be eligible for those sale prices. This allows us to maintain fair pricing for customers who purchase outside of sale periods.</p>
          </div>

          <div>
            <strong className="text-brand-black font-medium text-lg block border-b border-brand-black/10 pb-2 mb-4 mt-8">Cancellation Policy</strong>
            <p>
              JAHAN may cancel orders for any of the reasons mentioned here. Common reasons include: the item is out of stock, the item does not meet our quality standards or the issuing financial institution declines the credit/debit card payment.
            </p>
            <p className="mt-4">
              You can cancel your order at any time before the order has been processed. Once the product has been shipped, you will receive the tracking information and our "Exchange Policy" will apply. Instead of refunding, we will provide the customer with a credit note or a discount code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
