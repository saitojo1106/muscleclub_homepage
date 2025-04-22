"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../_components/admin-header";
import { isAuthenticated } from "@/lib/authUtils";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // クライアントサイドでの認証チェック
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">管理ダッシュボード</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/events" className="block">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">イベント管理</h2>
              <p className="text-gray-600 dark:text-gray-400">イベントの追加・編集・削除</p>
            </div>
          </Link>
          
          <Link href="/admin/members" className="block">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">部員管理</h2>
              <p className="text-gray-600 dark:text-gray-400">部員情報の追加・編集・削除</p>
            </div>
          </Link>
          
          <Link href="/admin/posts" className="block">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">ブログ管理</h2>
              <p className="text-gray-600 dark:text-gray-400">ブログ記事の追加・編集・削除</p>
            </div>
          </Link>
          
          <Link href="/admin/competitions" className="block">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">大会結果管理</h2>
              <p className="text-gray-600 dark:text-gray-400">大会・コンテストの成績記録</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}