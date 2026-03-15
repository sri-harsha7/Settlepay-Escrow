import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateDeal from './pages/CreateDeal';
import DealDetails from './pages/DealDetails';
import MockPayment from './pages/MockPayment';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/mock-payment/:id" element={<MockPayment />} />
            <Route path="*" element={
              <div className="container flex-col justify-center items-center text-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-secondary mb-6">The page you are looking for does not exist or the link is incorrect.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-deal" element={<CreateDeal />} />
              <Route path="/deals/:id" element={<DealDetails />} />
            </Route>
          </Routes>
        </main>
        <footer className="footer">
          <p>© {new Date().getFullYear()} Settlepay Escrow. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
