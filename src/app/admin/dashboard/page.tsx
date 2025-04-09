"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import Container from '@/app/_components/container';
import AdminHeader from '@/app/admin/_components/admin-header';
import AdminSidebar from '@/app/admin/_components/admin-sidebar';

export default function DashboardPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isLoggedIn, isLoading, router]);
  
  if (isLoading) {
    return <div>読み込み中...</div>;
  }
  
  if (!isLoggedIn) {
    return null;
  }
  
  return (
    <main className="min-h-screen">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <Container className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8">管理画面</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">イベント</h2>
              <p className="text-3xl font-bold text-blue-500">8</p>
              <p className="text-gray-500 dark:text-gray-400">登録されたイベント</p>
              <a href="/admin/events" className="text-blue-500 hover:underline mt-4 inline-block">
                管理する →
              </a>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">ブログ記事</h2>
              <p className="text-3xl font-bold text-green-500">12</p>
              <p className="text-gray-500 dark:text-gray-400">公開された記事</p>
              <a href="/admin/posts" className="text-blue-500 hover:underline mt-4 inline-block">
                管理する →
              </a>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">メンバー</h2>
              <p className="text-3xl font-bold text-purple-500">6</p>
              <p className="text-gray-500 dark:text-gray-400">登録されたメンバー</p>
              <a href="/admin/members" className="text-blue-500 hover:underline mt-4 inline-block">
                管理する →
              </a>
            </div>
          </div>
        </Container>
      </div>
    </main>
  );
}