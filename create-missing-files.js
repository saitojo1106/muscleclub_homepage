const fs = require('fs');
const path = require('path');

// 必要なディレクトリを作成する関数
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// 不足しているファイル定義
const files = [
  {
    path: 'src/lib/auth.ts',
    content: `const STORAGE_KEY = "muscle_club_admin_token";

// ログイン処理
export async function login(username: string, password: string): Promise<boolean> {
  // 簡易認証 (本番環境では適切な認証方法に置き換える)
  if (username === "admin" && password === "muscleclub2024") {
    // トークンを作成（有効期限は24時間）
    const token = {
      user: {
        username: "admin",
        role: "admin"
      },
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24時間
    };
    
    // ローカルストレージにトークンを保存
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
    }
    return true;
  }
  return false;
}

// ログアウト処理
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 認証状態の確認
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const tokenStr = localStorage.getItem(STORAGE_KEY);
    if (!tokenStr) return false;
    
    const token = JSON.parse(tokenStr);
    return Date.now() < token.expires;
  } catch (error) {
    return false;
  }
}

// ユーザー情報の取得
export function getUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const tokenStr = localStorage.getItem(STORAGE_KEY);
    if (!tokenStr) return null;
    
    const token = JSON.parse(tokenStr);
    if (Date.now() > token.expires) return null;
    
    return token.user;
  } catch (error) {
    return null;
  }
}
`
  },
  {
    path: 'src/app/_components/container.tsx',
    content: `import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = '' }: Props) {
  return <div className={\`container mx-auto px-5 \${className}\`}>{children}</div>;
}
`
  },
  {
    path: 'src/lib/supabase.ts',
    content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`
  }
];

// ファイルを書き込む
files.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  ensureDirectoryExistence(filePath);
  
  // ファイルが存在しない場合のみ作成
  if (!fs.existsSync(filePath)) {
    console.log(`Creating missing file: ${file.path}`);
    fs.writeFileSync(filePath, file.content, 'utf8');
  } else {
    console.log(`File already exists: ${file.path}`);
  }
});

console.log('All missing files created!');