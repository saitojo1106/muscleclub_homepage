// src/app/admin/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import AdminHeader from '@/app/admin/_components/admin-header';
import AdminSidebar from '@/app/admin/_components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();
  
  useEffect(() => {
    // 認証状態が確定し、ユーザーがログインしていないか管理者でない場合
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, loading, isAdmin, router]);
  
  // 読み込み中やリダイレクト中はローディングを表示
  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">読み込み中...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}