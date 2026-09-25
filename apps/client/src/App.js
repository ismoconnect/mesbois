import React from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet, Navigate } from 'react-router-dom';
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

// Pages (client)
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

// Pages Espace Client / Dashboard
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
  width: 100%;
  max-width: 100%;
  
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

// Layout pour les pages publiques (Header boutique + Layout principal)
function PublicLayout() {
  return (
    <AppContainer className="App">
      <Header />
      <Layout>
        <Outlet />
      </Layout>
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

// Layout pour les pages publiques minimales (sans Header boutique encombrant)
function MinimalPublicLayout() {
  return (
    <AppContainer className="App">
      <Outlet />
      <CookieBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
        }}
      />
    </AppContainer>
  );
}

// Layout 100% autonome pour l'Espace Client (Dashboard)
// Aucun Header public n'est injecté : DashboardLayout gère entièrement sa propre sidebar, son header et sa navigation
function DashboardRootLayout() {
  return (
    <AppContainer className="App dashboard-root">
      <Outlet />
      <CookieBanner />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
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

// Fonction pour générer les routes multilingues (/fr/..., /de/...)
function getLocalizedRoutes() {
  const languages = ['fr', 'de'];
  const routes = [];
  
  languages.forEach(lang => {
    routes.push(
      <React.Fragment key={lang}>
        {/* Pages publiques multilingues */}
        <Route path={lang} element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path={routeMapping.products[lang]} element={<Products />} />
          <Route path={`${routeMapping.productDetail[lang]}/:id`} element={<ProductDetail />} />
          <Route path={routeMapping.cart[lang]} element={<Cart />} />
          <Route path={routeMapping.checkout[lang]} element={<Checkout />} />
          <Route path={routeMapping.login[lang]} element={<Login />} />
          <Route path={routeMapping.register[lang]} element={<Register />} />
          <Route path={routeMapping.about[lang]} element={<About />} />
          <Route path={routeMapping.contact[lang]} element={<Contact />} />
          <Route path={routeMapping.legal[lang]} element={<Legal />} />
          <Route path={routeMapping.delivery[lang]} element={<Delivery />} />
          <Route path={routeMapping.returns[lang]} element={<Returns />} />
          <Route path={routeMapping.privacy[lang]} element={<Privacy />} />
          <Route path={routeMapping.terms[lang]} element={<Terms />} />
        </Route>

        {/* Pages autonomes multilingues */}
        <Route path={lang} element={<MinimalPublicLayout />}>
          <Route path={routeMapping.bankTransfer[lang]} element={<BankTransfer />} />
          <Route path={routeMapping.paypalPayment[lang]} element={<PayPalPayment />} />
          <Route path={routeMapping.authAction[lang]} element={<AuthAction />} />
        </Route>

        {/* Espace Client multilingue (ex: /fr/espace-client) -> Redirige proprement vers le dashboard indépendant */}
        <Route path={`${lang}/${routeMapping.dashboard[lang]}/*`} element={<Navigate to="/dashboard" replace />} />
        <Route path={`${lang}/${routeMapping.orders[lang]}`} element={<Navigate to="/dashboard/orders" replace />} />
        <Route path={`${lang}/${routeMapping.billing[lang]}`} element={<Navigate to="/dashboard/billing" replace />} />
        <Route path={`${lang}/${routeMapping.profile[lang]}`} element={<Navigate to="/dashboard/profile" replace />} />
        <Route path={`${lang}/${routeMapping.settings[lang]}`} element={<Navigate to="/dashboard/settings" replace />} />
        <Route path={`${lang}/${routeMapping.suivi[lang]}`} element={<Navigate to="/dashboard/suivi" replace />} />
      </React.Fragment>
    );
  });
  return routes;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LanguageRedirector />} />

      {/* ========================================================
          1. ESPACE CLIENT / DASHBOARD (100% INDÉPENDANT)
          Architecture dédiée : ses propres routes, sa propre sidebar,
          totalement découplé des pages publiques et protégé par PrivateRoute
          ======================================================== */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardRootLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="commandes" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="commandes/:id" element={<OrderDetail />} />
        <Route path="orders/:id/review" element={<OrderReview />} />
        <Route path="commandes/:id/review" element={<OrderReview />} />
        
        <Route path="billing" element={<Billing />} />
        <Route path="facturation" element={<Billing />} />
        
        <Route path="suivi" element={<Suivi />} />
        <Route path="suivi/:id" element={<SuiviItinerary />} />
        
        <Route path="profile" element={<Profile />} />
        <Route path="profil" element={<Profile />} />
        
        <Route path="settings" element={<Settings />} />
        <Route path="parametres" element={<Settings />} />
        
        <Route path="cart" element={<Navigate to="/dashboard" replace />} />
        <Route path="panier" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="products" element={<DashboardProducts />} />
        <Route path="produits" element={<DashboardProducts />} />
        <Route path="products/:id" element={<DashboardProductDetail />} />
        <Route path="produit/:id" element={<DashboardProductDetail />} />
        
        <Route path="checkout" element={<DashboardCheckout />} />
        <Route path="commande" element={<DashboardCheckout />} />
      </Route>

      {/* Alias directs du Dashboard pour éviter tout retour vers l'accueil */}
      <Route path="/espace-client" element={<Navigate to="/dashboard" replace />} />
      <Route path="/espace-client/*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/kundenbereich" element={<Navigate to="/dashboard" replace />} />
      <Route path="/kundenbereich/*" element={<Navigate to="/dashboard" replace />} />

      <Route path="/orders" element={<Navigate to="/dashboard/orders" replace />} />
      <Route path="/commandes" element={<Navigate to="/dashboard/commandes" replace />} />
      <Route path="/orders/:id" element={<PrivateRoute><DashboardRootLayout><OrderDetail /></DashboardRootLayout></PrivateRoute>} />
      <Route path="/commandes/:id" element={<PrivateRoute><DashboardRootLayout><OrderDetail /></DashboardRootLayout></PrivateRoute>} />

      <Route path="/billing" element={<Navigate to="/dashboard/billing" replace />} />
      <Route path="/facturation" element={<Navigate to="/dashboard/facturation" replace />} />

      <Route path="/suivi" element={<Navigate to="/dashboard/suivi" replace />} />
      <Route path="/suivi/:id" element={<PrivateRoute><DashboardRootLayout><SuiviItinerary /></DashboardRootLayout></PrivateRoute>} />

      <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
      <Route path="/profil" element={<Navigate to="/dashboard/profil" replace />} />

      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
      <Route path="/parametres" element={<Navigate to="/dashboard/parametres" replace />} />

      {/* ========================================================
          2. ROUTES PUBLIQUES DIRECTES (ACCESSIBLES AVEC OU SANS /fr/)
          Garantit que /login, /register, /cart, /checkout, etc. ne retournent JAMAIS à l'accueil
          ======================================================== */}
      <Route element={<PublicLayout />}>
        {/* Auth direct */}
        <Route path="/login" element={<Login />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/anmelden" element={<Login />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/inscription" element={<Register />} />
        <Route path="/registrieren" element={<Register />} />

        {/* Panier & Commande direct */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/warenkorb" element={<Cart />} />
        
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/commande" element={<Checkout />} />
        <Route path="/kasse" element={<Checkout />} />

        {/* Produits direct */}
        <Route path="/products" element={<Products />} />
        <Route path="/produits" element={<Products />} />
        <Route path="/produkte" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/produkt/:id" element={<ProductDetail />} />

        {/* Pages d'information direct */}
        <Route path="/about" element={<About />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/ueber-uns" element={<About />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/kontakt" element={<Contact />} />

        <Route path="/delivery" element={<Delivery />} />
        <Route path="/livraison" element={<Delivery />} />
        <Route path="/lieferung" element={<Delivery />} />

        <Route path="/returns" element={<Returns />} />
        <Route path="/retours" element={<Returns />} />
        <Route path="/rueckgabe" element={<Returns />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/confidentialite" element={<Privacy />} />
        <Route path="/datenschutz" element={<Privacy />} />

        <Route path="/terms" element={<Terms />} />
        <Route path="/cgv" element={<Terms />} />
        <Route path="/agb" element={<Terms />} />

        <Route path="/legal" element={<Legal />} />
        <Route path="/mentions-legales" element={<Legal />} />
        <Route path="/impressum" element={<Legal />} />
      </Route>

      {/* Pages publiques autonomes directes */}
      <Route element={<MinimalPublicLayout />}>
        <Route path="/bank-transfer" element={<BankTransfer />} />
        <Route path="/payment/bank" element={<BankTransfer />} />
        <Route path="/paiement/virement" element={<BankTransfer />} />
        <Route path="/zahlung/vorkasse" element={<BankTransfer />} />

        <Route path="/paypal-payment" element={<PayPalPayment />} />
        <Route path="/payment/paypal" element={<PayPalPayment />} />
        <Route path="/paiement/paypal" element={<PayPalPayment />} />
        <Route path="/zahlung/paypal" element={<PayPalPayment />} />

        <Route path="/auth/action" element={<AuthAction />} />
      </Route>

      {/* ========================================================
          3. ROUTES MULTILINGUES (/fr/*, /de/*)
          ======================================================== */}
      {getLocalizedRoutes()}

      {/* ========================================================
          4. FALLBACK ROUTE
          ======================================================== */}
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
