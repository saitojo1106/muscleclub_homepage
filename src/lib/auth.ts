// src/lib/auth.ts
const AUTH_TOKEN_KEY = 'muscle_club_admin_token';

export type User = {
  username: string;
  role: string;
};

export type AuthState = {
  user: User | null;
  expires: number;
};

// ログイン関数
export async function login(username: string, password: string): Promise<boolean> {
  // 開発用の簡易認証
  if (username === 'admin' && password === 'muscleclub2024') {
    const tokenData: AuthState = {
      user: { username: 'admin', role: 'admin' },
      expires: Date.now() + 24 * 60 * 60 * 1000 // 24時間有効
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(tokenData));
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
    return false; // サーバーサイドでは常にfalse
  }
  
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;
    
    const data = JSON.parse(token) as AuthState;
    return Date.now() < data.expires;
  } catch (error) {
    return false;
  }
}

// ユーザー情報取得関数
export function getUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const authData = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!authData) return null;
    
    const { user, expires } = JSON.parse(authData) as AuthState;
    if (Date.now() > expires) {
      logout();
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}