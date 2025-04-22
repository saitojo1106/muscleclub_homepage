import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// 環境変数が設定されていない場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase環境変数が設定されていません。');
  if (typeof window !== 'undefined') {
    // クライアントサイドのみ
    alert('Supabase設定エラー: 管理者に連絡してください');
  }
}

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabaseのテーブル型定義
export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string | null;
  requirements: string | null;
  fee: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};