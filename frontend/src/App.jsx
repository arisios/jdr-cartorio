import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Home from './pages/Home';
import Fluxo from './pages/Fluxo';
import Resultado from './pages/Resultado';
import SharedCertidao from './pages/SharedCertidao';
import AuthPage from './pages/AuthPage';
import AdminPanel from './pages/AdminPanel';
import LoadingSpinner from './components/LoadingSpinner';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-junina flex items-center justify-center"><LoadingSpinner size="lg"/></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace/>;
  return children;
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-junina flex items-center justify-center"><LoadingSpinner size="lg"/></div>;
  if (!user) return <Navigate to="/login" replace/>;
  return children;
}

function AppContent() {
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();
  return (
    <Routes>
      <Route path="/" element={resultado ? <Resultado data={resultado} onNew={() => setResultado(null)}/> : <PrivateRoute><Home/></PrivateRoute>}/>
      <Route path="/registrar" element={<PrivateRoute><Fluxo onSuccess={(data) => { setResultado(data); navigate('/'); }}/></PrivateRoute>}/>
      <Route path="/c/:token" element={<SharedCertidao/>}/>
      <Route path="/login" element={<AuthPage/>}/>
      <Route path="/admin/login" element={<Navigate to="/login" replace/>}/>
      <Route path="/admin" element={<AdminRoute><AdminPanel/></AdminRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent/>
      </BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        duration: 3500,
        style: { fontFamily:'DM Sans,sans-serif', borderRadius:12, border:'1px solid rgba(199,154,59,0.25)', boxShadow:'0 4px 20px rgba(58,31,20,0.1)' },
        success: { iconTheme: { primary:'#C21874', secondary:'#fff' } },
      }}/>
    </AuthProvider>
  );
}
