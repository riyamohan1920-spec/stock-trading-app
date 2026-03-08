import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { StockProvider } from './context/StockContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Transactions from './pages/Transactions';

function App() {
  return (
    <AuthProvider>
      <StockProvider>
        <Router>
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/market" element={<Market />} />
                <Route path="/stock/:symbol" element={<StockDetail />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/transactions" element={<Transactions />} />
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1e2130',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00c278', secondary: '#1e2130' } },
              error: { iconTheme: { primary: '#eb5757', secondary: '#1e2130' } },
            }}
          />
        </Router>
      </StockProvider>
    </AuthProvider>
  );
}

export default App;
