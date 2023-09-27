import './App.css';
import NotFound from './components/NotFound/NotFound';
import Anunciantes from './pages/Anunciantes/Anunciantes';
import Constraction from './pages/Constraction/Constraction';
import HomeBanner from './pages/HomeBanner/HomeBanner';
import Registration from './pages/Registration/Registration';
import pathname from './routes';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Negocio from './pages/Negocio/Negocio';
import SuccessPage from './components/SuccessPage/SuccessPage';
import { useState } from 'react';
import BrandAnimation from './components/BrandAnimation/BrandAnimation';

function App() {
  const [loading, setLoading] = useState(true);
  window.onload = () => {
    setLoading(false);
  };

  return (
    <div className="App">
      {loading && <BrandAnimation setLoading={setLoading} />}
      <Routes>
        <Route path={pathname.home} element={<HomeBanner />} ></Route>
        <Route path={pathname.registration} element={<Registration />} />
        <Route path={pathname.anunciantes} element={<Anunciantes />} />
        <Route path={pathname.constraction} element={<Constraction />} />
        <Route path={`${pathname.negocio}/:id_business`} element={<Negocio />} />
        <Route path={pathname.success} element={<SuccessPage />} />
        <Route path={pathname.notFound} element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"  
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
