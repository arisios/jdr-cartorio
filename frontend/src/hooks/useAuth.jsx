import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('cj_token');
    const stored = localStorage.getItem('cj_user');
    if (token && stored) { try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('cj_token'); } }
    setLoading(false);
  }, []);
  const login = async (identifier, password) => {
    const { data } = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('cj_token', data.token);
    localStorage.setItem('cj_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem('cj_token'); localStorage.removeItem('cj_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
