import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Product from './pages/Product';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';
// import NotFound from './pages/NotFound'; // Optional

import './styles/app.css';

const App = () => {
  const location = useLocation();
  const hideHeaderFooterRoutes = ['/login', '/signup', '/terms'];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-gif-wrapper">
      <div className="overlay">
        {/* Header */}
        {!shouldHideHeaderFooter && <Header />}

        <main>
          <Routes>
            {/* Public Routes only */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product" element={<Product />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />

            {/* Optional 404 */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </main>

        {/* Footer */}
        {!shouldHideHeaderFooter && <Footer />}
      </div>
    </div>
  );
};

export default App;
