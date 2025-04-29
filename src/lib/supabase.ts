import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../types/supabase';

// クライアントサイド判定
const isClient = typeof window !== 'undefined';

// Supabaseクライアント型
type TypedSupabaseClient = SupabaseClient<Database>;

// Supabaseクライアントのシングルトンパターン
class SupabaseService {
  private static instance: TypedSupabaseClient | null = null;
  
  // 直接のインスタンス化を防ぐプライベートコンストラクタ
  private constructor() {}
  
  // Supabaseクライアントインスタンスを取得（シングルトンパターン）
  static getInstance(): TypedSupabaseClient {
    if (!this.instance) {
      // 環境に応じて適切なクライアント初期化を使用
      if (isClient) {
        // クライアントサイド: createClientComponentClientを使用して自動トークン更新とストレージ処理
        this.instance = createClientComponentClient<Database>();
      } else {
        // サーバーサイド: 環境変数を使用した標準のcreateClient
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        this.instance = createClient<Database>(supabaseUrl, supabaseAnonKey);
      }
    }
    return this.instance;
  }
  
  // インスタンスをリセット（テスト用）
  static resetInstance(): void {
    this.instance = null;
  }
}

// 後方互換性のためのSupabaseクライアントインスタンスをエクスポート
export const supabase = SupabaseService.getInstance();

// 高度な使用のためのサービスをエクスポート
export const supabaseService = SupabaseService;
