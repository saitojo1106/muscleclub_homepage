import { supabase } from './supabase';

const AUTH_TOKEN_KEY = 'muscle_club_admin_token';

// 単純なログイン関数
export function login(username: string, password: string): boolean {
  // 開発用の簡易認証
  if (username === 'admin' && password === 'muscleclub2024') {
    const tokenData = {
      user: { username: 'admin', role: 'admin' },
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24時間有効
    };
    
    localStorage.setItem('auth_token', JSON.stringify(tokenData));
    return true;
  }
  
  return false;
}

// ログアウト関数
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

// 認証状態確認関数
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false; // サーバーサイドでは常にfalse
  }
  
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    const data = JSON.parse(token);
    return Date.now() < data.expires;
  } catch (error) {
    return false;
  }
}

// ユーザー情報取得関数
export function getUser() {
  if (typeof window === 'undefined') {
    return null; // サーバーサイドレンダリング時はnull
  }

  try {
    const authData = localStorage.getItem('auth_token');
    if (!authData) return null;
    
    const { user, expires } = JSON.parse(authData);
    if (Date.now() > expires) {
      logout();
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}
