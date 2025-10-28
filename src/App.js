import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Layout from './components/Layout/Layout';
import Header from './components/Layout/Header';
import styled from 'styled-components';

// Pages
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
import About from './pages/About';
import Contact from './pages/Contact';

// Styles globaux
import './App.css';

const AppContainer = styled.div`
  position: relative;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding-top: 60px;
    overflow-x: hidden;
  }
  
  @media (max-width: 480px) {
    padding-top: 55px;
  }
  
  @media (max-width: 375px) {
    padding-top: 50px;
  }
`;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContainer className="App">
            <Header />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
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
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

