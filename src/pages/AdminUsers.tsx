import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  }

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    const headers = "User ID,Name,Email,Role\n";
    const csv = users.map(u => 
      `"${u._id}","${u.name || 'Guest'}","${u.email || ''}","${u.role || 'user'}"`
    ).join("\n");
    
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `users_export.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif">Users Management</h2>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-medium rounded hover:bg-zinc-50 transition"
        >
          <Download className="w-3 h-3" /> Export
        </button>
      </div>
      <div className="bg-white p-8 border border-brand-black/10">
        {users.length === 0 ? (
          <p className="text-sm text-[#555]">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brand-black/10 text-xs uppercase tracking-widest text-[#555]">
                  <th className="pb-4 pr-4 font-medium">User ID</th>
                  <th className="pb-4 pr-4 font-medium">Name</th>
                  <th className="pb-4 pr-4 font-medium">Email</th>
                  <th className="pb-4 pr-4 font-medium">Role</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/5">
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="py-4 pr-4 text-xs font-mono text-[#555]">{u._id}</td>
                    <td className="py-4 pr-4 text-sm font-medium">{u.name || 'Guest'}</td>
                    <td className="py-4 pr-4 text-sm text-[#555]">{u.email}</td>
                    <td className="py-4 pr-4">
                      <select 
                        value={u.role || 'user'} 
                        onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        className="text-xs border border-brand-black/20 p-1 focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 text-right space-x-4">
                      <button onClick={() => confirmDelete(u._id)} className="text-red-500 hover:opacity-70 transition-opacity text-xs uppercase tracking-widest font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <h3 className="font-serif text-xl tracking-tight text-brand-black mb-2">Delete User</h3>
            <p className="text-zinc-500 text-sm mb-6">Are you sure you want to delete this specific user? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition bg-zinc-100 hover:bg-zinc-200 rounded">Cancel</button>
              <button onClick={handleDeleteUser} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
