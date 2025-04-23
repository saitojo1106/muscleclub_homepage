import { supabase } from './supabase';

const AUTH_TOKEN_KEY = 'muscle_club_admin_token';

// 単純なログイン関数
export function login(username: string, password: string): boolean {
  // 固定の認証情報
  if (username === 'admin' && password === 'muscleclub2024') {
    // 認証トークンをローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify({
        user: { name: 'Administrator', role: 'admin' },
        expires: Date.now() + 24 * 60 * 60 * 1000 // 24時間後に期限切れ
      }));
    }
    return true;
  }
  return false;
}

// ログアウト関数
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// 認証状態確認関数
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false; // サーバーサイドレンダリング時は未認証扱い
  }

  try {
    const authData = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!authData) return false;
    
    const { expires } = JSON.parse(authData);
    return Date.now() < expires;
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
    const authData = localStorage.getItem(AUTH_TOKEN_KEY);
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
