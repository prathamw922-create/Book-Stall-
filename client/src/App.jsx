import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { PageLoader } from './components/ui/Spinner';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';

// Pages
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyOrdersPage from './pages/MyOrdersPage';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';
// import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-surface-50">
    <Navbar />
    <main className="grow pt-16 lg:pt-20">
      {children}
    </main>
    <Footer />
    <WhatsAppButton />
  </div>
);

function App() {
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/books" element={<Layout><CatalogPage /></Layout>} />
      <Route path="/books/:id" element={<Layout><BookDetailPage /></Layout>} />
      
      <Route path="/cart" element={<Layout><CartPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

      {/* Protected Routes (Customer) */}
      
      <Route path="/checkout" element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} />
      <Route path="/order-confirmation/:id" element={<ProtectedRoute><Layout><OrderConfirmationPage /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><Layout><MyOrdersPage /></Layout></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><Layout><WishlistPage /></Layout></ProtectedRoute>} />

      {/* Protected Routes (Admin) */}
      
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/books" element={<ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>} />
      

      {/* 404 */}
      {/* <Route path="*" element={<Layout><NotFoundPage /></Layout>} /> */}
    </Routes>
  );
}

export default App;
