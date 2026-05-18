import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, subtotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    whatsappNumber: '',
    secondaryNumber: '',
    address: '',
    city: '',
    country: '',
    zip: '',
    notes: '',
  });

  const [validationErrors, setValidationErrors] = useState<any>({});

  const shippingCost = 10;
  const total = subtotal + shippingCost;

  const validatePhone = (number: string) => {
    // Basic international phone number validation: allows +, digits, spaces, dashes
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    return phoneRegex.test(number);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setValidationErrors({});
    let hasErrors = false;
    let errors: any = {};

    if (!validateEmail(shippingInfo.email)) {
      errors.email = "Please enter a valid email address";
      hasErrors = true;
    }

    if (!validatePhone(shippingInfo.whatsappNumber)) {
      errors.whatsappNumber = "Please enter a valid WhatsApp number (e.g. +1234567890)";
      hasErrors = true;
    }
    
    if (shippingInfo.secondaryNumber && !validatePhone(shippingInfo.secondaryNumber)) {
      errors.secondaryNumber = "Please enter a valid phone number";
      hasErrors = true;
    }

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            items: cart,
            subtotal,
            shippingCost,
            total,
            shippingInfo
          })
        });
      } catch (err) {
        console.error(err);
      }
    }
    
    // Mock payment/order creation
    alert("Payment successful! Your order has been placed.");
    clearCart();
    navigate('/account');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif mb-6 text-brand-black">Your Cart is Empty</h1>
        <Link to="/" className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12">
      <h1 className="text-3xl lg:text-4xl font-serif text-brand-black mb-12">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-lg font-serif mb-6 text-brand-black">Shipping Information</h2>
          <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Email <span className="text-red-500">*</span></label>
              <input required type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
              {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
            </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">First Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="firstName" value={shippingInfo.firstName} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Last Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="lastName" value={shippingInfo.lastName} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                </div>
              </div>
              
              <div className="bg-brand-black/5 p-6 rounded-md space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs uppercase tracking-widest font-medium opacity-70">Primary WhatsApp Number <span className="text-red-500">*</span></label>
                  </div>
                  <input required type="tel" name="whatsappNumber" value={shippingInfo.whatsappNumber} onChange={handleInputChange} placeholder="+1234567890" className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                  {validationErrors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.whatsappNumber}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs uppercase tracking-widest font-medium opacity-70">Backup Contact Number <span className="text-brand-black/40 lowercase tracking-normal">(Optional)</span></label>
                  </div>
                  <p className="text-[11px] text-brand-black/60 mb-2">Provide a backup number in case we cannot reach you on WhatsApp.</p>
                  <input type="tel" name="secondaryNumber" value={shippingInfo.secondaryNumber} onChange={handleInputChange} placeholder="+1234567890" className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                  {validationErrors.secondaryNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.secondaryNumber}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Address <span className="text-red-500">*</span></label>
                <input required type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">City <span className="text-red-500">*</span></label>
                  <input required type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Country <span className="text-red-500">*</span></label>
                  <input required type="text" name="country" value={shippingInfo.country} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Zip Code <span className="text-red-500">*</span></label>
                  <input required type="text" name="zip" value={shippingInfo.zip} onChange={handleInputChange} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Notes/Instructions <span className="text-brand-black/40 lowercase tracking-normal">(Optional)</span></label>
                <input type="text" name="notes" value={shippingInfo.notes} onChange={handleInputChange} placeholder="Special delivery instructions..." className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent transition-colors" />
              </div>
          </form>
        </div>

        <div className="bg-brand-cream/50 p-8 rounded-lg h-fit">
          <h2 className="text-lg font-serif mb-6 text-brand-black">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[150px] truncate text-brand-black">{item.name}</span>
                    <div className="flex items-center gap-3 mt-2 bg-brand-black/5 w-fit px-1.5 py-0.5 rounded">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-brand-black/60 hover:text-brand-black transition-colors rounded">
                         -
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-brand-black/60 hover:text-brand-black transition-colors rounded">
                         +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col flex-shrink-0 items-end gap-2">
                  <button type="button" onClick={() => removeFromCart(item.id)} className="text-[10px] uppercase tracking-wider text-brand-black/50 hover:text-red-500 transition-colors">
                    Remove
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    {item.compareAtPrice ? (
                      <>
                        <span className="text-brand-black/40 text-[10px] line-through">${(item.compareAtPrice * item.quantity).toFixed(2)}</span>
                        <span className="text-red-700 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="text-brand-black font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-brand-black/10 pt-6 space-y-4">
            <div className="flex justify-between text-sm text-brand-black/70">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-black/70">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-serif text-brand-black pt-4 border-t border-brand-black/10">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            form="checkout-form"
            className="w-full mt-8 bg-brand-black text-brand-white py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
