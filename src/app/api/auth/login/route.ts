// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Attempt to sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Auth error:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: '認証に失敗しました：' + (error.message || '不明なエラー') 
        },
        { status: 401 }
      );
    }
    
    // Check if the user has an admin role
    // This assumes you've set up user metadata with role information
    const isAdmin = data.user?.user_metadata?.role === 'admin';
    
    if (!isAdmin) {
      // Sign out if the user is not an admin
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, message: '管理者権限がありません' },
        { status: 403 }
      );
    }

    // Successfully authenticated as admin
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: data.user.id,
        email: data.user.email,
        role: 'admin'
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
