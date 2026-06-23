import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setUser(parsed);
      // Verify token is still valid
      API.get('/auth/me')
        .then((res) => {
          setUser({ ...res.data, token: parsed.token });
        })
        .catch(() => {
          localStorage.removeItem('userInfo');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, phone, password) => {
    const { data } = await API.post('/auth/register', { name, email, phone, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const { data } = await API.put('/auth/profile', updates);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updated = { ...userInfo, ...data };
    localStorage.setItem('userInfo', JSON.stringify(updated));
    setUser(updated);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
