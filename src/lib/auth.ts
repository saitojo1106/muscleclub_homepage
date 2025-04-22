import { supabase } from './supabase';

// メールアドレスとパスワードでログイン
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('ログインエラー:', error);
    return { success: false, error };
  }
}

// ログアウト
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('ログアウトエラー:', error);
    return { success: false, error };
  }
}

// 現在のユーザーを取得
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    return data.user;
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    return null;
  }
}

// セッション変更の監視
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}