import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, DollarSign, Package, ShoppingCart, Users, LogOut, Star, FileText, Mail, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Auth error', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-cream text-brand-black">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Sliders', path: '/admin/sliders', icon: <ImageIcon className="w-5 h-5" /> },
    { name: 'CMS', path: '/admin/cms', icon: <FileText className="w-5 h-5" /> },
    { name: 'Cash Management', path: '/admin/cash', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Subscribers', path: '/admin/subscribers', icon: <Mail className="w-5 h-5" /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Star className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex text-brand-black overflow-hidden relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside 
        className={`bg-brand-black text-brand-white flex flex-col transition-all duration-300 ease-in-out whitespace-nowrap z-30 shadow-xl
          ${isSidebarOpen ? 'w-64 max-w-[256px] px-6 py-8' : 'w-0 max-w-0 p-0 overflow-hidden'} 
          fixed md:relative inset-y-0 left-0
        `}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="px-2 flex items-center gap-3">
            <img src="/logo.svg" alt="JAHAN" className="h-6 w-auto object-contain invert grayscale mix-blend-screen opacity-90" />
            <span className="block font-serif text-lg tracking-[0.2em]">JAHAN</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-brand-white/50 hover:text-brand-white transition-colors p-1 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 text-sm font-medium tracking-wide w-full pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-white/20 hover:scrollbar-thumb-brand-white/40">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                  ? 'bg-brand-white/10 text-brand-white' 
                  : 'text-brand-white/60 hover:text-brand-white hover:bg-brand-white/5'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium tracking-wide text-brand-white/50 hover:text-brand-white hover:bg-brand-white/5 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-y-auto h-screen relative flex flex-col z-10 w-full transition-all duration-300">
        <header className="bg-white border-b border-black/5 px-6 py-4 flex items-center shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`mr-4 p-2 rounded-md transition-colors ${isSidebarOpen ? 'text-brand-black/40 hover:bg-black/5 hover:text-brand-black' : 'text-brand-black hover:bg-black/5'}`}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-brand-black/10 flex items-center justify-center text-sm font-medium text-brand-black uppercase">
                 {user?.email?.charAt(0) || 'A'}
             </div>
          </div>
        </header>

        <div className="p-10 flex-1 relative overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
