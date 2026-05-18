import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Plus, Edit2, Trash2, Search, Calendar, Download, ChevronUp, ChevronDown, CheckCircle2
} from 'lucide-react';
import { format, parseISO, subDays } from 'date-fns';
import { useCashManagementStore, SalesEntry } from '../store/cashManagementStore';

export default function AdminCashManagement() {
  const { entries, addEntry, updateEntry, deleteEntry } = useCashManagementStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('30');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    totalSales: '',
    expenses: '',
    productCost: '',
    notes: ''
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculate stats
  const calculatedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(entry => ({
      ...entry,
      profit: entry.totalSales - entry.expenses - entry.productCost
    }));
  }, [entries]);

  const sortedEntries = [...calculatedEntries].reverse();

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalRev = calculatedEntries.reduce((sum, e) => sum + e.totalSales, 0);
    const totalExp = calculatedEntries.reduce((sum, e) => sum + e.expenses + e.productCost, 0);
    const totalProf = calculatedEntries.reduce((sum, e) => sum + e.profit, 0);
    
    // Last 30 days profit
    const last30Days = calculatedEntries.filter(e => new Date(e.date) >= subDays(new Date(), 30));
    const monthlyProfit = last30Days.reduce((sum, e) => sum + e.profit, 0);

    // Last 7 days profit
    const last7Days = calculatedEntries.filter(e => new Date(e.date) >= subDays(new Date(), 7));
    const weeklyProfit = last7Days.reduce((sum, e) => sum + e.profit, 0);

    const today = calculatedEntries[calculatedEntries.length - 1] || null;
    const bestDay = [...calculatedEntries].sort((a, b) => b.totalSales - a.totalSales)[0] || null;

    // Monthly growth logic
    const last60 = calculatedEntries.slice(-60);
    const currentMonthRev = last60.filter(e => new Date(e.date) >= subDays(new Date(), 30)).reduce((sum, e) => sum + e.totalSales, 0);
    const prevMonthRev = last60.filter(e => new Date(e.date) >= subDays(new Date(), 60) && new Date(e.date) < subDays(new Date(), 30)).reduce((sum, e) => sum + e.totalSales, 0);
    const growth = prevMonthRev ? ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100 : 0;

    return { totalRev, totalExp, totalProf, monthlyProfit, weeklyProfit, today, bestDay, growth };
  }, [calculatedEntries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      date: formData.date,
      totalSales: parseFloat(formData.totalSales),
      expenses: parseFloat(formData.expenses),
      productCost: parseFloat(formData.productCost),
      notes: formData.notes
    };

    if (editId) {
      updateEntry(editId, payload);
      showToast('Entry updated successfully.');
      setEditId(null);
    } else {
      addEntry(payload);
      showToast('Sales entry added successfully.');
    }

    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      totalSales: '',
      expenses: '',
      productCost: '',
      notes: ''
    });
    setIsFormOpen(false);
  };

  const editRow = (entry: any) => {
    setFormData({
      date: entry.date,
      totalSales: String(entry.totalSales),
      expenses: String(entry.expenses),
      productCost: String(entry.productCost),
      notes: entry.notes || ''
    });
    setEditId(entry.id);
    setIsFormOpen(true);
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setDeleteId(id);
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteEntry(deleteId);
      showToast('Entry deleted successfully.');
      setDeleteId(null);
    }
  }

  const filteredData = sortedEntries.filter(entry => {
    const matchesSearch = (entry.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (dateFilter === '7') {
      return matchesSearch && new Date(entry.date) >= subDays(new Date(), 7);
    }
    if (dateFilter === '30') {
      return matchesSearch && new Date(entry.date) >= subDays(new Date(), 30);
    }
    return matchesSearch;
  });

  const exportCSV = () => {
    const headers = "Date,Total Sales,Expenses,Product Cost,Profit,Notes\n";
    const csv = filteredData.map(row => 
      `${row.date},${row.totalSales},${row.expenses},${row.productCost},${row.profit},"${row.notes || ''}"`
    ).join("\n");
    
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `cash_management_report.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Chart Data preparation
  const chartData = useMemo(() => {
    let raw = calculatedEntries;
    if (dateFilter === '7') raw = calculatedEntries.filter(e => new Date(e.date) >= subDays(new Date(), 7));
    if (dateFilter === '30') raw = calculatedEntries.filter(e => new Date(e.date) >= subDays(new Date(), 30));
    return raw.map(e => ({
      name: format(new Date(e.date), 'MMM dd'),
      Sales: e.totalSales,
      Profit: e.profit,
      Expenses: e.expenses + e.productCost
    }));
  }, [calculatedEntries, dateFilter]);


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in bg-brand-black text-white px-6 py-3 rounded shadow-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-brand-gold" />
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-brand-black tracking-tight mb-2">Cash Management</h2>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Monitor revenue, expenses, and profitability.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm font-medium rounded hover:bg-zinc-50 transition"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button 
            onClick={() => { setEditId(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-black text-white text-sm font-medium rounded hover:bg-brand-charcoal transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Today's Sales" 
          value={`$${metrics.today?.totalSales.toLocaleString() || '0'}`}
          sub={metrics.today ? format(new Date(metrics.today.date), 'MMMM dd') : ''}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard 
          title="Total Revenue (All Time)" 
          value={`$${metrics.totalRev.toLocaleString()}`}
          trend={metrics.growth}
          icon={<Activity className="w-5 h-5" />}
        />
        <StatCard 
          title="Monthly Profit (30 Days)" 
          value={`$${metrics.monthlyProfit.toLocaleString()}`}
          sub={`Weekly: $${metrics.weeklyProfit.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard 
          title="Best Sales Day" 
          value={`$${metrics.bestDay?.totalSales.toLocaleString() || '0'}`}
          sub={metrics.bestDay ? format(new Date(metrics.bestDay.date), 'MMMM dd, yyyy') : ''}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-900 tracking-tight">Revenue vs Profit</h3>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border border-zinc-200 px-3 py-1.5 rounded-md text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-black"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A1A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1A1A1A" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A972" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C6A972" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="Sales" stroke="#1A1A1A" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="Profit" stroke="#C6A972" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-zinc-900 tracking-tight mb-6">Sales vs Expenses Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                <Bar dataKey="Sales" fill="#1A1A1A" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expenses" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-zinc-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-zinc-900 tracking-tight">Sales History</h3>
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-zinc-200 rounded-md text-sm outline-none focus:border-brand-black transition w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="bg-zinc-50/50 text-zinc-900 border-b border-zinc-100 uppercase tracking-wider text-[11px] font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Sales</th>
                <th className="px-6 py-4">Expenses</th>
                <th className="px-6 py-4">Cost of Goods</th>
                <th className="px-6 py-4">Net Profit</th>
                <th className="px-6 py-4 w-1/4">Notes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-400">
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map(entry => (
                  <tr key={entry.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-zinc-900">
                      {format(new Date(entry.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">${entry.totalSales.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600">-${entry.expenses.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600">-${entry.productCost.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-emerald-600">${entry.profit.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="truncate block max-w-[200px] text-zinc-500">{entry.notes || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => editRow(entry)} className="p-2 text-zinc-400 hover:text-brand-black transition"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => confirmDelete(entry.id)} className="p-2 text-zinc-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-serif text-xl tracking-tight text-brand-black text-left">{editId ? 'Edit Entry' : 'New Sales Entry'}</h3>
              <button onClick={() => { setIsFormOpen(false); setEditId(null); }} className="text-zinc-400 hover:text-zinc-700">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Total Sales ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.totalSales}
                    onChange={e => setFormData({...formData, totalSales: e.target.value})}
                    placeholder="0.00"
                    className="w-full border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Expenses ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    value={formData.expenses}
                    onChange={e => setFormData({...formData, expenses: e.target.value})}
                    placeholder="0.00"
                    className="w-full border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black" 
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Product Cost ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={formData.productCost}
                  onChange={e => setFormData({...formData, productCost: e.target.value})}
                  placeholder="0.00"
                  className="w-full border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black" 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any context for today's sales..."
                  rows={3}
                  className="w-full border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-brand-black resize-none" 
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => { setIsFormOpen(false); setEditId(null); }} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-brand-black text-white text-sm font-medium rounded hover:bg-brand-charcoal transition shadow-sm">
                  {editId ? 'Save Changes' : 'Record Sales'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl tracking-tight text-brand-black mb-2">Delete Entry</h3>
            <p className="text-zinc-500 text-sm mb-6">Are you sure you want to delete this specific record? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition bg-zinc-100 hover:bg-zinc-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, trend, sub, icon, invertTrend = false }: any) {
  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-brand-black transform group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <span className="text-zinc-500 text-[11px] font-semibold tracking-widest uppercase mb-1">{title}</span>
      <span className="text-3xl font-serif text-brand-black tracking-tight mb-2">{value}</span>
      <div className="flex items-center gap-2 mt-auto">
        {trend !== undefined && (
          <span className={`flex items-center text-xs font-medium ${trend >= 0 ? (invertTrend ? 'text-red-600' : 'text-emerald-600') : (invertTrend ? 'text-emerald-600' : 'text-red-600')}`}>
            {trend >= 0 ? <ChevronUp className="w-3 h-3 mr-0.5" /> : <ChevronDown className="w-3 h-3 mr-0.5" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-zinc-400">{sub}</span>}
      </div>
    </div>
  );
}
