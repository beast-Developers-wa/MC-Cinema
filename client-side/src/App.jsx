import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Product from './pages/Product';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Terms from './pages/Terms';

import './styles/app.css';

const App = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/signup', '/login' ,'/terms'];

  return (
    <div className="bg-gif-wrapper">
      <div className="overlay">
        {!hideHeaderRoutes.includes(location.pathname) && <Header />}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
