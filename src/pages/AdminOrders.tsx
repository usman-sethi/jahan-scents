import React, { useState, useEffect } from 'react';
import { Download, Upload, Printer, Link as LinkIcon, Phone, MessageCircle, Copy, Info, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTracking, setEditingTracking] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('pipeline');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
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
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleUpdateTracking = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ trackingNumber })
      });
      if (res.ok) {
        setEditingTracking(null);
        fetchOrders();
      }
    } catch(err) {
      console.error(err);
    }
  };

  const printInvoice = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const itemsHtml = order.items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ccc;">${item.name} x ${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ccc; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; }
            h1 { font-weight: 300; letter-spacing: 2px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 40px; }
            .details { margin-bottom: 40px; line-height: 1.6; }
            table { w-full; border-collapse: collapse; margin-bottom: 40px; width: 100%; }
            th { text-align: left; padding: 8px; border-bottom: 2px solid #1a1a1a; }
            .total { font-size: 20px; font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>JAHAN</h1>
              <p>Invoice #${order._id}</p>
            </div>
            <div style="text-align: right;">
              <p>${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div class="details">
            <h3>Bill To:</h3>
            <p>${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}<br/>
            ${order.shippingInfo?.address}<br/>
            ${order.shippingInfo?.city}, ${order.shippingInfo?.country} ${order.shippingInfo?.zip}<br/>
            ${order.shippingInfo?.email}<br/>
            ${order.shippingInfo?.whatsappNumber ? `WhatsApp: ${order.shippingInfo.whatsappNumber}<br/>` : ''}
            ${order.shippingInfo?.secondaryNumber ? `Alt: ${order.shippingInfo.secondaryNumber}<br/>` : ''}</p>
            ${order.shippingInfo?.notes ? `<p><strong>Notes:</strong> ${order.shippingInfo.notes}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="total">
            Total: $${order.total?.toFixed(2)}
          </div>
          <div style="margin-top: 60px; font-size: 12px; color: #666; text-align: center;">
            Thank you for shopping with JAHAN.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) return;
    const headers = "Order ID,Customer,Email,Primary WhatsApp,Secondary Contact,Address,City,Country,Zip,Notes,Date,Total,Status,Tracking Number,Items\n";
    const csv = orders.map(o => {
      const itemsStr = o.items ? o.items.map((i: any) => `${i.quantity}x ${i.name}`).join('; ') : '';
      return `"${o._id}","${o.shippingInfo?.firstName} ${o.shippingInfo?.lastName}","${o.shippingInfo?.email}","${o.shippingInfo?.whatsappNumber || ''}","${o.shippingInfo?.secondaryNumber || ''}","${o.shippingInfo?.address}","${o.shippingInfo?.city}","${o.shippingInfo?.country}","${o.shippingInfo?.zip}","${o.shippingInfo?.notes || ''}","${new Date(o.createdAt).toLocaleDateString()}",${o.total?.toFixed(2)},"${o.status}","${o.trackingNumber || ''}","${itemsStr}"`;
    }).join("\n");
    
    const blob = new Blob([headers + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'orders_export_full.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div>Loading orders...</div>;

  const pipelineColumns = [
    { id: 'processing', title: 'Processing' },
    { id: 'bottling', title: 'Bottling' },
    { id: 'shipped', title: 'Shipped' },
    { id: 'delivered', title: 'Delivered' },
  ];

  const getOrdersByStatus = (status: string) => {
    // For 'bottling', map to orders with status 'bottling'. If older orders don't have it, they fall in others.
    return orders.filter(o => o.status === status || (status === 'processing' && !['bottling', 'shipped','delivered', 'returned', 'cancelled'].includes(o.status)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif">Orders Management</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-brand-black/10 rounded overflow-hidden">
            <button 
              onClick={() => setViewMode('pipeline')}
              className={`p-2 transition-colors ${viewMode === 'pipeline' ? 'bg-brand-black/5 text-brand-black' : 'text-brand-black/50 hover:text-brand-black'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-brand-black/5 text-brand-black' : 'text-brand-black/50 hover:text-brand-black'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={exportOrdersCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-medium rounded hover:bg-zinc-50 transition"
          >
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'pipeline' ? (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex overflow-x-auto gap-4 pb-4 min-h-[60vh]"
          >
            {pipelineColumns.map(col => {
              const colOrders = getOrdersByStatus(col.id);
              return (
                <div key={col.id} className="flex-1 min-w-[280px] flex flex-col bg-brand-black/5 rounded-sm p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg text-brand-black capitalize">{col.title}</h3>
                    <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full font-medium">{colOrders.length}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {colOrders.map(o => (
                      <div key={o._id} className="bg-white p-4 shadow-sm border border-brand-black/5 rounded-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono text-brand-black/50">#{o._id.slice(-6)}</span>
                          <span className="text-xs font-medium">${o.total?.toFixed(2)}</span>
                        </div>
                        <h4 className="font-medium text-sm text-brand-black mb-1">{o.shippingInfo?.firstName} {o.shippingInfo?.lastName}</h4>
                        <p className="text-xs text-brand-black/60 mb-4">{o.items?.length || 0} items</p>
                        
                        <select 
                          value={o.status || 'processing'} 
                          onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                          className="w-full text-[10px] uppercase tracking-widest px-2 py-1.5 border border-brand-black/20 rounded-sm cursor-pointer outline-none focus:border-brand-black"
                        >
                          <option value="processing">Processing</option>
                          <option value="bottling">Bottling</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white p-8 border border-brand-black/10"
          >
            {orders.length === 0 ? (
              <p className="text-sm text-[#555]">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-brand-black/10 text-xs uppercase tracking-widest text-[#555]">
                      <th className="pb-4 pr-4 font-medium">Order ID</th>
                      <th className="pb-4 pr-4 font-medium">Customer</th>
                      <th className="pb-4 pr-4 font-medium">Date</th>
                      <th className="pb-4 pr-4 font-medium">Total</th>
                      <th className="pb-4 pr-4 font-medium">Status & Tracking</th>
                      <th className="pb-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-black/5">
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td className="py-4 pr-4 text-sm font-medium">#{o._id.slice(-6)}</td>
                        <td className="py-4 pr-4 text-sm text-[#555]">
                           <div className="font-medium text-brand-black">{o.shippingInfo?.firstName} {o.shippingInfo?.lastName}</div>
                           <div className="text-xs mb-1">{o.shippingInfo?.email}</div>
                           {o.shippingInfo?.whatsappNumber && (
                             <div className="flex items-center gap-2 mt-2">
                               <MessageCircle className="w-3 h-3 text-green-600" />
                               <span className="text-xs font-medium text-green-700">{o.shippingInfo.whatsappNumber}</span>
                               <button onClick={() => navigator.clipboard.writeText(o.shippingInfo.whatsappNumber)} className="text-gray-400 hover:text-black">
                                 <Copy className="w-3 h-3" />
                               </button>
                               <a href={`https://wa.me/${o.shippingInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-wider bg-green-100 text-green-700 px-1.5 py-0.5 rounded ml-1 hover:bg-green-200 transition">
                                 Chat
                               </a>
                             </div>
                           )}
                           {o.shippingInfo?.secondaryNumber && (
                             <div className="flex items-center gap-2 mt-1">
                               <Phone className="w-3 h-3 text-gray-500" />
                               <span className="text-xs text-gray-600">{o.shippingInfo.secondaryNumber}</span>
                               <button onClick={() => navigator.clipboard.writeText(o.shippingInfo.secondaryNumber)} className="text-gray-400 hover:text-black">
                                 <Copy className="w-3 h-3" />
                               </button>
                             </div>
                           )}
                           {o.shippingInfo?.notes && (
                             <div className="flex items-start gap-1 mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 max-w-xs">
                               <Info className="w-3 h-3 shrink-0 mt-0.5" />
                               <span className="leading-tight">{o.shippingInfo.notes}</span>
                             </div>
                           )}
                        </td>
                        <td className="py-4 pr-4 text-sm text-[#555]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 pr-4 text-sm font-medium">${o.total?.toFixed(2)}</td>
                        <td className="py-4 pr-4">
                          <div className="mb-2">
                            <select 
                              value={o.status} 
                              onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                              className={`text-[10px] uppercase tracking-widest px-2 py-1 border-0 rounded cursor-pointer ${o.status === 'processing' ? 'bg-amber-100 text-amber-800' : o.status === 'bottling' ? 'bg-indigo-100 text-indigo-800' : o.status === 'shipped' ? 'bg-blue-100 text-blue-800' : o.status === 'delivered' ? 'bg-green-100 text-green-800' : o.status === 'returned' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
                            >
                              <option value="processing">Processing</option>
                              <option value="bottling">Bottling</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="returned">Returned</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {editingTracking === o._id ? (
                              <div className="flex items-center gap-1">
                                <input 
                                  type="text" 
                                  value={trackingNumber} 
                                  onChange={(e) => setTrackingNumber(e.target.value)}
                                  placeholder="Tracking #" 
                                  className="text-xs border border-brand-black/20 px-2 py-1 w-24 focus:outline-none"
                                />
                                <button onClick={() => handleUpdateTracking(o._id)} className="text-xs bg-brand-black text-white px-2 py-1">Save</button>
                                <button onClick={() => setEditingTracking(null)} className="text-xs text-gray-500 hover:text-brand-black">Cancel</button>
                              </div>
                            ) : (
                               <div className="flex items-center gap-1 text-xs text-gray-500">
                                 {o.trackingNumber ? (
                                   <span className="flex items-center gap-1"><LinkIcon className="w-3 h-3"/> {o.trackingNumber}</span>
                                 ) : (
                                   <span>No tracking</span>
                                 )}
                                 <button onClick={() => { setEditingTracking(o._id); setTrackingNumber(o.trackingNumber || ''); }} className="underline hover:text-brand-black ml-1">Edit</button>
                               </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-right space-y-2">
                          <button 
                            onClick={() => printInvoice(o)} 
                            className="flex items-center justify-end gap-1 w-full text-xs text-brand-black hover:opacity-70 uppercase tracking-widest font-medium"
                          >
                            <Printer className="w-3 h-3" /> Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
