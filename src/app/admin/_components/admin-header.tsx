"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function AdminHeader() {
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };
  
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
            onClick={handleLogout}
            className="px-3 py-1 bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}