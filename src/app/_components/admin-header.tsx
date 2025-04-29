// src/app/admin/_components/admin-header.tsx
"use client";

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/admin/dashboard" className="text-xl font-bold text-gray-800 dark:text-white">
                マッスルクラブ 管理画面
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}