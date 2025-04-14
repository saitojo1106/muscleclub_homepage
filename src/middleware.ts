import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// ミドルウェア関数を定義
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 管理者ページは認証が必要
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // トークンがない場合はログインページにリダイレクト
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: ['/admin/:path*'],
};