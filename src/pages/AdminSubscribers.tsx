import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/subscribers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const header = ['Email', 'Phone', 'Date Subscribed'];
    const csvRules = subscribers.map(s => [
      s.email || '',
      s.phone || '',
      new Date(s.createdAt).toLocaleDateString()
    ].map(v => `"${v}"`).join(','));
    
    const csvContent = [header.join(','), ...csvRules].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) return <div>Loading subscribers...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-brand-black">Newsletter Subscribers</h2>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-black/20 text-brand-black text-xs font-medium rounded-sm hover:bg-brand-black/5 transition-colors"
        >
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-8 border border-brand-black/10 rounded-sm">
        {subscribers.length === 0 ? (
          <p className="text-sm text-brand-black/50">No subscribers found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-black/10 text-xs uppercase tracking-widest text-[#555]">
                  <th className="pb-4 pr-4 font-medium">Email</th>
                  <th className="pb-4 pr-4 font-medium">Phone Number</th>
                  <th className="pb-4 pr-4 font-medium text-right">Date Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/5">
                {subscribers.map((sub, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={sub._id || index}
                    className="hover:bg-brand-black/[0.02] transition-colors"
                  >
                    <td className="py-4 pr-4 text-sm font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black/40">
                        <Mail className="w-4 h-4" />
                      </div>
                      {sub.email || '-'}
                    </td>
                    <td className="py-4 pr-4 text-sm text-brand-black/70">
                      {sub.phone ? (
                        <span className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-brand-black/40" />
                          {sub.phone}
                        </span>
                      ) : (
                        <span className="text-brand-black/30 text-xs">Not provided</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-sm text-brand-black/60 text-right">
                      <span className="flex items-center justify-end gap-2">
                        <Calendar className="w-3 h-3 opacity-50" />
                        {new Date(sub.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
