import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '' });

  useEffect(() => {
    const fetchAccountData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/orders', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
          setFormData({ name: userData.name || '', phone: userData.phone || '', password: '' });
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
        
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAccountData();
  }, [navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setUser((prev: any) => ({ ...prev, name: formData.name, phone: formData.phone }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) return <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">Loading...</div>;

  return (
    <div className="pt-32 pb-24 max-w-[1400px] mx-auto px-6 lg:px-12 min-h-screen">
      <h1 className="text-3xl lg:text-4xl font-serif text-brand-black mb-12">My Account</h1>
      
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-brand-cream/50 p-6">
            <h2 className="text-xl font-serif mb-2 text-brand-black">{user?.name || "Guest"}</h2>
            <p className="text-sm text-brand-black/60 mb-6">{user?.email}</p>
            <div className="space-y-4 text-[11px] uppercase tracking-widest text-brand-black font-medium">
              <button onClick={() => setIsEditing(false)} className={`block w-full text-left hover:text-brand-taupe transition-colors py-2 ${!isEditing ? 'border-b border-brand-black' : ''}`}>Order History</button>
              <button onClick={() => setIsEditing(true)} className={`block w-full text-left hover:text-brand-taupe transition-colors py-2 ${isEditing ? 'border-b border-brand-black' : ''}`}>Account Details</button>
              <button onClick={() => navigate('/wishlist')} className="block w-full text-left hover:text-brand-taupe transition-colors py-2">Wishlist</button>
              <button onClick={handleLogout} className="block w-full text-left hover:text-brand-taupe transition-colors py-2 opacity-60">Logout</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-3/4">
          {isEditing ? (
            <div>
              <h2 className="text-2xl font-serif mb-6 text-brand-black">Account Details</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-medium mb-2 opacity-70">New Password (optional)</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border-b border-brand-black/30 pb-2 px-2 focus:outline-none focus:border-brand-black bg-transparent" />
                </div>
                <button type="submit" className="bg-brand-black text-brand-white px-8 py-4 text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-zinc-800 transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-serif mb-6 text-brand-black">Order History</h2>
              {orders.length === 0 ? (
                <p className="text-sm text-brand-black/60">You haven't placed any orders yet.</p>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-brand-black/10 p-6">
                      <div className="flex justify-between items-start mb-6 pb-6 border-b border-brand-black/10">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-1">Order Placed</p>
                          <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest text-brand-black/50 mb-1">Total</p>
                          <p className="text-sm font-medium border border-brand-black/10 px-3 py-1 bg-brand-cream/50">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover" />
                            <div>
                              <p className="font-serif text-brand-black text-sm">{item.name}</p>
                              <p className="text-[11px] uppercase tracking-widest text-[#555] mt-1">Qty: {item.quantity}</p>
                            </div>
                            <p className="ml-auto text-sm text-[#555]">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
