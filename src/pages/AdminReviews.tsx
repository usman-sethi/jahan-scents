import React, { useState, useEffect } from 'react';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6">Review Moderation</h2>
      
      <div className="bg-white p-8 border border-brand-black/10">
        {reviews.length === 0 ? (
          <p className="text-sm text-[#555]">No reviews found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-black/10 text-xs uppercase tracking-widest text-[#555]">
                  <th className="pb-4 pr-4 font-medium">Date</th>
                  <th className="pb-4 pr-4 font-medium">Product ID</th>
                  <th className="pb-4 pr-4 font-medium">Author</th>
                  <th className="pb-4 pr-4 font-medium">Rating</th>
                  <th className="pb-4 pr-4 font-medium">Comment</th>
                  <th className="pb-4 pr-4 font-medium">Status</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/5">
                {reviews.map(r => (
                  <tr key={r._id}>
                    <td className="py-4 pr-4 text-sm text-[#555] whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 pr-4 text-sm font-medium">{r.productId}</td>
                    <td className="py-4 pr-4 text-sm text-[#555]">{r.name}</td>
                    <td className="py-4 pr-4 text-sm text-[#555]">{r.rating} / 5</td>
                    <td className="py-4 pr-4 text-sm text-[#555] max-w-xs truncate">{r.comment}</td>
                    <td className="py-4 pr-4">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded ${r.status === 'approved' ? 'bg-green-100 text-green-800' : r.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                       {r.status !== 'approved' && (
                         <button onClick={() => handleUpdateStatus(r._id, 'approved')} className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Approve</button>
                       )}
                       {r.status !== 'rejected' && (
                         <button onClick={() => handleUpdateStatus(r._id, 'rejected')} className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600">Reject</button>
                       )}
                       <button onClick={() => handleDelete(r._id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
