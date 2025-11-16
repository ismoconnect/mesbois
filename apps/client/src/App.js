import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Header from './components/Layout/Header';
import styled from 'styled-components';
import PrivateRoute from './components/Auth/PrivateRoute';

// Pages (client) – eager where needed
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import BankTransfer from './pages/BankTransfer';
import OrderReview from './pages/OrderReview';
import About from './pages/About';
import Contact from './pages/Contact';

import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Suivi from './pages/Suivi';
import SuiviItinerary from './pages/SuiviItinerary';
import DashboardCart from './pages/DashboardCart';
import DashboardProducts from './pages/DashboardProducts';
import DashboardCheckout from './pages/DashboardCheckout';

// Styles globaux
import './App.css';

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

function RootLayout() {
  const location = useLocation();
  const path = location.pathname || '';
  const isDashboard = path === '/dashboard';
  const isDashboardArea = (
    isDashboard ||
    path.startsWith('/dashboard/') ||
    path === '/profile' ||
    path === '/orders' ||
    path.startsWith('/orders/') ||
    path === '/settings' ||
    path.startsWith('/settings/') ||
    path === '/billing' ||
    path.startsWith('/billing/') ||
    path === '/suivi' ||
    path.startsWith('/suivi/')
  );
  const isMinimalArea = isDashboardArea || path.startsWith('/payment/bank');
  return (
    <AppContainer className="App">
      {!isMinimalArea && <Header />}
      {isMinimalArea ? (
        <Outlet />
      ) : (
        <Layout $noHeader={isMinimalArea}>
          <Outlet />
        </Layout>
      )}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#27ae60',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#e74c3c',
              secondary: '#fff',
            },
          },
        }}
      />
    </AppContainer>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="product/:id" element={<ProductDetail />} />
      
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="dashboard/cart" element={<PrivateRoute><DashboardCart /></PrivateRoute>} />
      <Route path="dashboard/products" element={<PrivateRoute><DashboardProducts /></PrivateRoute>} />
      <Route path="dashboard/checkout" element={<PrivateRoute><DashboardCheckout /></PrivateRoute>} />
      <Route path="billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
      <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
      <Route path="orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
      <Route path="payment/bank" element={<BankTransfer />} />
      <Route path="orders/:id/review" element={<PrivateRoute><OrderReview /></PrivateRoute>} />
      <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="suivi" element={<PrivateRoute><Suivi /></PrivateRoute>} />
      <Route path="suivi/:id" element={<PrivateRoute><SuiviItinerary /></PrivateRoute>} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider 
          router={router}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

