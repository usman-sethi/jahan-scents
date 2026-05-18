import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

const salesData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const productData = [
  { name: 'Santal Mystique', val: 400 },
  { name: 'Noir Absolu', val: 300 },
  { name: 'Bergamot Blanc', val: 300 },
  { name: 'Rose épicée', val: 200 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalSales: 0, orders: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const [ordersRes, usersRes] = await Promise.all([
          fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (ordersRes.ok && usersRes.ok) {
          const orders = await ordersRes.json();
          const users = await usersRes.json();
          const totalSales = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
          setStats({ totalSales, orders: orders.length, users: users.length });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl">
      <h2 className="text-3xl font-serif mb-8 text-brand-black">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-2">Total Revenue</p>
            <p className="text-2xl font-serif">${stats.totalSales.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 bg-brand-black/5 flex items-center justify-center rounded-full text-brand-black">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-2">Total Orders</p>
            <p className="text-2xl font-serif">{stats.orders}</p>
          </div>
          <div className="w-10 h-10 bg-brand-black/5 flex items-center justify-center rounded-full text-brand-black">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-2">Total Users</p>
            <p className="text-2xl font-serif">{stats.users}</p>
          </div>
          <div className="w-10 h-10 bg-brand-black/5 flex items-center justify-center rounded-full text-brand-black">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-black/50 mb-2">Conversion</p>
            <p className="text-2xl font-serif">3.4%</p>
          </div>
          <div className="w-10 h-10 bg-brand-black/5 flex items-center justify-center rounded-full text-brand-black">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-brand-black/70 mb-6 font-medium">Sales Overview (7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="sales" stroke="#1c1917" strokeWidth={2} activeDot={{ r: 8 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1c1917', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`$${value}`, 'Sales']}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Chart */}
        <div className="bg-white p-6 border border-brand-black/5 rounded-sm shadow-sm">
          <h3 className="text-sm uppercase tracking-widest text-brand-black/70 mb-6 font-medium">Top Fragrances</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{ backgroundColor: '#1c1917', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="val" fill="#1c1917" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
