import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

const ClientLayout = lazy(() => import('../pages/ClientLayout'));
const Home = lazy(() => import('../pages/Home'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const Category = lazy(() => import('../pages/Category'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const ContactUs = lazy(() => import('../pages/ContactUs'));
const ShippingAndDelivery = lazy(() => import('../pages/ShippingAndDelivery'));
const ExchangesAndReturns = lazy(() => import('../pages/ExchangesAndReturns'));
const FiftyMl = lazy(() => import('../pages/FiftyMl'));
const Demo = lazy(() => import('../pages/Demo'));
const AdminLayout = lazy(() => import('../pages/AdminLayout'));
const AdminProducts = lazy(() => import('../pages/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/AdminUsers'));
const AdminSubscribers = lazy(() => import('../pages/AdminSubscribers'));
const AdminSliders = lazy(() => import('../pages/AdminSliders'));
const AdminCashManagement = lazy(() => import('../pages/AdminCashManagement'));
const AdminReviews = lazy(() => import('../pages/AdminReviews'));
const AdminCMS = lazy(() => import('../pages/AdminCMS'));
const Login = lazy(() => import('../pages/Login'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Account = lazy(() => import('../pages/Account'));
const Wishlist = lazy(() => import('../pages/Wishlist'));
const Cart = lazy(() => import('../pages/Cart'));

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-cream">
    <div className="w-8 h-8 border-2 border-brand-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Note: To animate routing properly, AnimatePresence wraps the Routes,
// but for the transition to show without unmounting the whole layout,
// the PageTransition wrapper is implemented inside ClientLayout for client routes.
// However, since we want cinematic transitions between ALL pages including admin/login,
// we can wrap the whole Routes here.

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<ContactUs />} />
          <Route path="shipping" element={<ShippingAndDelivery />} />
          <Route path="exchanges" element={<ExchangesAndReturns />} />
          <Route path="demo" element={<Demo />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cart" element={<Cart />} />
          <Route path="account" element={<Account />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="collection/50ml" element={<FiftyMl />} />
          <Route path=":categoryId" element={<Category />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscribers" element={<AdminSubscribers />} />
          <Route path="sliders" element={<AdminSliders />} />
          <Route path="cash" element={<AdminCashManagement />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="cms" element={<AdminCMS />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
}
