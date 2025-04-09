"use client";

import Link from 'next/link';
import { useAuth } from '@/app/auth/auth-context';

export default function AdminHeader() {
  const { logout } = useAuth();
  
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin/dashboard" className="text-xl font-bold">
          マッスルクラブ 管理画面
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:underline" target="_blank">
            サイトを表示
          </Link>
          <button 
            onClick={logout}
            className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}