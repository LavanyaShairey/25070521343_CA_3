import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';

// Pages
import ExploreEvents from './pages/ExploreEvents';
import MyTickets from './pages/MyTickets';
import CreateEvent from './pages/CreateEvent';
import CampusClubs from './pages/CampusClubs';
import CampusBuzz from './pages/CampusBuzz';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component (Redirects to /login if unauthenticated)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Only Route (for login/register - redirects to /events if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/events" replace />;
  }

  return children;
};

// Main App Layout with Navbar & Container
const MainLayout = () => {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100">
      <Navbar onSearch={setGlobalSearch} searchQuery={globalSearch} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<ExploreEvents />} />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route path="/clubs" element={<CampusClubs />} />
          <Route path="/buzz" element={<CampusBuzz />} />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 font-medium">
            <span className="text-amber-400 font-bold">EventHive</span>
            <span>— College Event Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">MongoDB Community Server Connected</span>
          </p>
          <p className="text-slate-400">
            Built for university hackathons, fests, workshops & club activities.
          </p>
        </div>
      </footer>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
