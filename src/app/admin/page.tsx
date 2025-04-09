"use client";

import { useState, useEffect } from 'react';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import Link from 'next/link';
import { getAllEvents } from '@/lib/admin/event-service';
import type { Event } from '@/lib/events';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // ローカルストレージから認証状態を復元
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadEvents();
    }
  }, []);
  
  const loadEvents = async () => {
    const eventData = await getAllEvents();
    setEvents(eventData);
  };
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 簡易認証（本番環境ではより堅牢な方法を使用すること）
    if (password === 'muscleclub2024') { // 仮のパスワード
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      loadEvents();
    } else {
      alert('パスワードが間違っています');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };
  
  if (!isAuthenticated) {
    return (
      <main>
        <Container>
          <Header />
          <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">管理者ログイン</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                ログイン
              </button>
            </form>
          </div>
        </Container>
      </main>
    );
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">管理画面</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ログアウト
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/admin/events" className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">イベント管理</h2>
            <p className="text-gray-600 dark:text-gray-400">イベントの追加・編集・削除</p>
          </Link>
          
          <Link href="/admin/posts" className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">ブログ管理</h2>
            <p className="text-gray-600 dark:text-gray-400">記事の投稿・編集・削除</p>
          </Link>
          
          <Link href="/admin/members" className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">部員管理</h2>
            <p className="text-gray-600 dark:text-gray-400">部員情報の追加・編集・削除</p>
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">最近のイベント</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">イベント名</th>
                  <th className="py-2 px-4 text-left">日付</th>
                  <th className="py-2 px-4 text-left">場所</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id} className="border-t">
                    <td className="py-2 px-4">{event.title}</td>
                    <td className="py-2 px-4">{new Date(event.date).toLocaleDateString('ja-JP')}</td>
                    <td className="py-2 px-4">{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </main>
  );
}