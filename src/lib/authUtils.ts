import { supabase } from './supabase';

const AUTH_TOKEN_KEY = 'muscle_club_admin_token';

// ログイン
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('ログインエラー:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true, user: data.user };
}

// ログアウト
export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('ログアウトエラー:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// 認証状態確認
export async function isAuthenticated() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

// 現在のユーザー情報取得
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}