import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Bakery } from '../types';
import { authApi } from '../services/authApi';
import { useToast } from './ToastContext';

interface AuthContextValue {
  user: User | null;
  bakery: Bakery | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bakery, setBakery] = useState<Bakery | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('wl_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem('wl_token');
    if (!storedToken) {
      setUser(null);
      setBakery(null);
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.getMe();
      setUser(data.user);
      setBakery(data.bakery || null);
    } catch (err) {
      localStorage.removeItem('wl_token');
      setToken(null);
      setUser(null);
      setBakery(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password: pass });
      localStorage.setItem('wl_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await fetchCurrentUser();
      success(`Welcome back, ${res.user.full_name}!`);
    } catch (err: any) {
      error(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      localStorage.setItem('wl_token', res.token);
      setToken(res.token);
      setUser(res.user);
      await fetchCurrentUser();
      success('Account created successfully! Welcome to Whisk & Layers.');
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('wl_token');
    setToken(null);
    setUser(null);
    setBakery(null);
    success('You have been signed out.');
  };

  const switchDemoRole = async (role: UserRole) => {
    let email = 'customer@whiskandlayers.com';
    let pass = 'Customer123!';

    if (role === 'BAKERY') {
      email = 'sweetcrust@whiskandlayers.com';
      pass = 'Bakery123!';
    } else if (role === 'ADMIN') {
      email = 'admin@whiskandlayers.com';
      pass = 'Admin123!';
    }

    await login(email, pass);
  };

  const refreshProfile = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        bakery,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
