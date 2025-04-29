// src/app/api/auth/login/route.ts
/ 変更後
   const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
   const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

   export async function POST(request: Request) {
     try {
       const { username, password } = await request.json();

       if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
         return NextResponse.json(
           { success: false, message: '管理者認証情報が設定されていません' },
           { status: 500 }
         );
       }
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