import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterVendor from './pages/RegisterVendor';
import TrackOrder from './pages/student/TrackOrder';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseVendors from './pages/student/BrowseVendors';
import VendorMenu from './pages/student/VendorMenu';
import OrderConfirmation from './pages/student/OrderConfirmation';
import ActiveOrders from './pages/student/ActiveOrders';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import LiveQueue from './pages/vendor/LiveQueue';
import MenuManager from './pages/vendor/MenuManager';
import OrderHistory from './pages/vendor/OrderHistory';
import Analytics from './pages/vendor/Analytics';
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/vendor" element={<RegisterVendor />} />
        <Route path="/track" element={<TrackOrder />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/vendors" element={
          <ProtectedRoute role="student"><BrowseVendors /></ProtectedRoute>
        } />
        <Route path="/student/vendor/:vendorId" element={
          <ProtectedRoute role="student"><VendorMenu /></ProtectedRoute>
        } />
        <Route path="/student/order-confirmation" element={
          <ProtectedRoute role="student"><OrderConfirmation /></ProtectedRoute>
        } />
        <Route path="/student/orders" element={
          <ProtectedRoute role="student"><ActiveOrders /></ProtectedRoute>
        } />
        <Route path="/student/track" element={
          <ProtectedRoute role="student"><TrackOrder /></ProtectedRoute>
        } />

        {/* Vendor Routes */}
        <Route path="/vendor/dashboard" element={
          <ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>
        } />
        <Route path="/vendor/queue" element={
          <ProtectedRoute role="vendor"><LiveQueue /></ProtectedRoute>
        } />
        <Route path="/vendor/menu" element={
          <ProtectedRoute role="vendor"><MenuManager /></ProtectedRoute>
        } />
        <Route path="/vendor/history" element={
          <ProtectedRoute role="vendor"><OrderHistory /></ProtectedRoute>
        } />
        <Route path="/vendor/analytics" element={
          <ProtectedRoute role="vendor"><Analytics /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;