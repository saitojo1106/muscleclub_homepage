// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'muscleclub2024';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return NextResponse.json({ 
        success: true, 
        user: { username, role: 'admin' } 
      });
    }
    
    return NextResponse.json(
      { success: false, message: '認証に失敗しました' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'サーバーエラー' },
      { status: 500 }
    );
  }
}