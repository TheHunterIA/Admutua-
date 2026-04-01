import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import ForceRedirectOnReload from './components/layout/ForceRedirectOnReload';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Departments from './pages/Departments';
import Congregations from './pages/Congregations';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import EBD from './pages/EBD';
import NewsDetail from './pages/NewsDetail';
import Missoes from './pages/Missoes';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ForceRedirectOnReload />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/cultos" element={<Services />} />
          <Route path="/departamentos" element={<Departments />} />
          <Route path="/ebd" element={<EBD />} />
          <Route path="/congregacoes" element={<Congregations />} />
          <Route path="/lideranca" element={<Leadership />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/missoes" element={<Missoes />} />
        </Routes>
      </Layout>
    </Router>
  );
}
