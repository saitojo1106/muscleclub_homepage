import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ミドルウェア関数をエクスポート
export function middleware(request: NextRequest) {

  // パスを取得
  const path = request.nextUrl.pathname;
  
  // 管理者ページへのアクセスを制限
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // 実際の認証ロジックは後で実装（今はスルーさせる）
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: ['/admin/:path*'],
};