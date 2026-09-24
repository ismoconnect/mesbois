import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import routeMapping from './utils/routeMapping.json';
import i18n from './i18n';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import Layout from './components/Layout/Layout';
import Header from './components/Layout/Header';
import CookieBanner from './components/Layout/CookieBanner';
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
import PayPalPayment from './pages/PayPalPayment';
import OrderReview from './pages/OrderReview';
import About from './pages/About';
import Contact from './pages/Contact';
import Delivery from './pages/Delivery';
import Returns from './pages/Returns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Legal from './pages/Legal';

import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Suivi from './pages/Suivi';
import SuiviItinerary from './pages/SuiviItinerary';
import DashboardCart from './pages/DashboardCart';
import DashboardProducts from './pages/DashboardProducts';
import DashboardCheckout from './pages/DashboardCheckout';
import DashboardProductDetail from './pages/DashboardProductDetail';
import AuthAction from './pages/AuthAction';

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
  const isMinimalArea = isDashboardArea || path.startsWith('/payment/bank') || path.startsWith('/payment/paypal');
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
      <CookieBanner />
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

// Composant pour rediriger la racine / vers la bonne langue
function LanguageRedirector() {
  const lang = i18n.language || 'fr';
  return <Navigate to={`/${lang}`} replace />;
}

// Fonction pour générer les routes dynamiques
function getLocalizedRoutes() {
  const languages = ['fr', 'de'];
  const routes = [];
  
  languages.forEach(lang => {
    routes.push(
      <Route key={lang} path={lang} element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path={routeMapping.products[lang]} element={<Products />} />
        <Route path={`${routeMapping.productDetail[lang]}/:id`} element={<ProductDetail />} />

        <Route path={routeMapping.cart[lang]} element={<Cart />} />
        <Route path={routeMapping.checkout[lang]} element={<Checkout />} />
        <Route path={routeMapping.login[lang]} element={<Login />} />
        <Route path={routeMapping.register[lang]} element={<Register />} />
        
        <Route path={routeMapping.dashboard[lang]} element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path={routeMapping.dashboardCart[lang]} element={<PrivateRoute><DashboardCart /></PrivateRoute>} />
        <Route path={routeMapping.dashboardProducts[lang]} element={<PrivateRoute><DashboardProducts /></PrivateRoute>} />
        <Route path={`${routeMapping.dashboardProductDetail[lang]}/:id`} element={<PrivateRoute><DashboardProductDetail /></PrivateRoute>} />
        <Route path={routeMapping.dashboardCheckout[lang]} element={<PrivateRoute><DashboardCheckout /></PrivateRoute>} />
        
        <Route path={routeMapping.billing[lang]} element={<PrivateRoute><Billing /></PrivateRoute>} />
        <Route path={routeMapping.profile[lang]} element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path={routeMapping.orders[lang]} element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path={`${routeMapping.orderDetail[lang]}/:id`} element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
        <Route path={`${routeMapping.orderReview[lang]}/:id/review`} element={<PrivateRoute><OrderReview /></PrivateRoute>} />
        
        <Route path={routeMapping.bankTransfer[lang]} element={<BankTransfer />} />
        <Route path={routeMapping.paypalPayment[lang]} element={<PayPalPayment />} />
        <Route path={routeMapping.authAction[lang]} element={<AuthAction />} />
        <Route path={routeMapping.settings[lang]} element={<PrivateRoute><Settings /></PrivateRoute>} />
        
        <Route path={routeMapping.suivi[lang]} element={<PrivateRoute><Suivi /></PrivateRoute>} />
        <Route path={`${routeMapping.suiviItinerary[lang]}/:id`} element={<PrivateRoute><SuiviItinerary /></PrivateRoute>} />
        
        <Route path={routeMapping.about[lang]} element={<About />} />
        <Route path={routeMapping.contact[lang]} element={<Contact />} />
        <Route path={routeMapping.legal[lang]} element={<Legal />} />
        <Route path={routeMapping.delivery[lang]} element={<Delivery />} />
        <Route path={routeMapping.returns[lang]} element={<Returns />} />
        <Route path={routeMapping.privacy[lang]} element={<Privacy />} />
        <Route path={routeMapping.terms[lang]} element={<Terms />} />
      </Route>
    );
  });
  return routes;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LanguageRedirector />} />
      {getLocalizedRoutes()}
      {/* Fallback pour les anciennes routes (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteSettingsProvider>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          />
        </SiteSettingsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

