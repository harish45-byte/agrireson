import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import FarmerDashboard from './pages/FarmerDashboard';
import ManageProducts from './pages/ManageProducts';
import ExpenseManagement from './pages/ExpenseManagement';
import ProfitDashboard from './pages/ProfitDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />

                {/* Buyer Protected Routes */}
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Farmer Protected Routes */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/products"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                      <ManageProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/expenses"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                      <ExpenseManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farmer/profit"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_FARMER', 'ROLE_ADMIN']}>
                      <ProfitDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
