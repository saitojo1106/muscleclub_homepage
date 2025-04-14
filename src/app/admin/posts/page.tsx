"use client";

import { useState, useEffect } from 'react';
import Container from '@/app/_components/container';
import Link from 'next/link';

export default function PostsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // 認証チェック
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
      return;
    }
    setIsAuthenticated(true);
  }, []);
  
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ブログ管理</h1>
          <Link href="/admin" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            管理画面トップへ戻る
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-6">
          <p className="text-lg mb-4">ブログ管理機能は現在開発中です。</p>
          <p>この機能は今後のアップデートで追加される予定です。</p>
        </div>
      </Container>
    </main>
  );
}