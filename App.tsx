import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/ui/BackToTop';
import { ThemeProvider } from './context/ThemeContext';
import { PricingProvider } from './context/PricingContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './components/Home';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Showcase from './components/pages/Showcase';
import About from './components/pages/About';
import Blog from './components/pages/Blog';
import Changelog from './components/pages/Changelog';
import Careers from './components/pages/Careers';
import Legal from './components/pages/Legal';
import Dashboard from './components/pages/Dashboard';
import SuperAdmin from './components/pages/SuperAdmin';
import PublicProfile from './components/pages/PublicProfile';

// Layout wrapper for public pages to include Navbar/Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

// Route wrapper to conditionally render layout
const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-primary overflow-x-hidden selection:bg-indigo-500/30 flex flex-col transition-colors duration-300">
      <ScrollToTop />
      <Toaster />

      <Routes>
        {/* Dashboard Route - No Navbar/Footer (Protected) */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* SuperAdmin Route - Internal Auth Handling */}
        <Route path="/superadmin" element={<SuperAdmin />} />

        {/* Public Routes - With Navbar/Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
        <Route path="/showcase" element={<PublicLayout><Showcase /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/changelog" element={<PublicLayout><Changelog /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><Careers /></PublicLayout>} />
        <Route path="/legal" element={<PublicLayout><Legal /></PublicLayout>} />

        {/* Public Profile Route (Catch-all) */}
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PricingProvider>
          <Router>
            <AppContent />
          </Router>
        </PricingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;