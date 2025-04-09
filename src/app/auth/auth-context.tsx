"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ローカルストレージからログイン状態を確認
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // 本番環境では、実際のAPIを使用した認証を実装
    // この例では簡易認証
    if (username === 'admin' && password === 'muscleclub2024') {
      localStorage.setItem('auth_token', 'dummy_token');
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}