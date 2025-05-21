import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterrPage';
import UserPage from './pages/UserPage';
import Navbar from './components/NavBar';
import { AuthProvider, useAuth } from '../context/authContext';
import Biblioteca from './pages/Biblioteca';
import ForYouPage from './pages/ForYouPage';
import PaginaCarte  from './pages/PaginaCarte';

// Componentă Layout pentru rutele protejate
const ProtectedLayout = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16 md:pt-0"> {/* Spațiu pentru navbar pe mobile */}
        <Outlet />
      </div>
    </>
  );
};

// Componentă Layout pentru rutele publice
const PublicLayout = () => (
  <>
    <Outlet />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rute Publice fără navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rute Protejate cu navbar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/biblioteca/:id" element={<PaginaCarte />} />
           
            <Route path='/foryou' element={<ForYouPage/>}/>
          </Route>

          {/* Redirect pentru rute necunoscute */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
