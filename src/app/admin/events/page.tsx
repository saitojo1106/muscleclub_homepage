"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from '@/components/container';
import Link from 'next/link';
import { getAllEvents, addEvent, updateEvent, deleteEvent } from '@/lib/admin/event-service';
import type { Event } from '@/lib/events';

export default function EventsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    id: 0,
    title: '',
    date: '',
    location: '',
    description: '',
    requirements: '',
    fee: '',
  });
  
  useEffect(() => {
    // 認証チェック - NextAuth
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      fetchEvents();
    }
  }, [status, router]);
  
  const fetchEvents = async () => {
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
    } catch (error) {
      console.error('イベントの取得中にエラーが発生しました:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateEvent(currentEvent);
      } else {
        // idを除外したオブジェクトをaddEventに渡す
        const { id, ...eventWithoutId } = currentEvent;
        await addEvent(eventWithoutId);
      }
      
      setIsFormVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('イベントの保存中にエラーが発生しました:', error);
      alert('エラーが発生しました。詳細はコンソールを確認してください。');
    }
  };
  
  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setIsFormVisible(true);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('このイベントを削除してもよろしいですか？')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error('イベントの削除中にエラーが発生しました:', error);
        alert('エラーが発生しました。詳細はコンソールを確認してください。');
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };
  
  // ローディング中の表示
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  // 未認証の場合は何も表示しない（useEffectでリダイレクト処理をしているため）
  if (!session) {
    return null;
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">イベント管理</h1>
          <Link href="/admin/dashboard" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            ダッシュボードへ戻る
          </Link>
        </div>
        
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              setIsFormVisible(true);
              setIsEditing(false);
              setCurrentEvent({
                id: 0,
                title: '',
                date: '',
                location: '',
                description: '',
                requirements: '',
                fee: '',
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            新規イベント作成
          </button>
        </div>
        
        {isFormVisible && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? 'イベントを編集' : '新規イベントを作成'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">イベント名</label>
                <input
                  type="text"
                  name="title"
                  value={currentEvent.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">日付</label>
                <input
                  type="date"
                  name="date"
                  value={currentEvent.date}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">場所</label>
                <input
                  type="text"
                  name="location"
                  value={currentEvent.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">説明</label>
                <textarea
                  name="description"
                  value={currentEvent.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">参加条件</label>
                <input
                  type="text"
                  name="requirements"
                  value={currentEvent.requirements}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">料金</label>
                <input
                  type="text"
                  name="fee"
                  value={currentEvent.fee}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? '更新' : '作成'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="py-3 px-4 text-left">イベント名</th>
                  <th className="py-3 px-4 text-left">日付</th>
                  <th className="py-3 px-4 text-left">場所</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4">{event.title}</td>
                    <td className="py-3 px-4">{new Date(event.date).toLocaleDateString('ja-JP')}</td>
                    <td className="py-3 px-4">{event.location}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(event)} className="text-blue-500 hover:text-blue-700">編集</button>
                        <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700">削除</button>
                      </div>
                    </td>
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