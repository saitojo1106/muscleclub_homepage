"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/auth-context';
import Container from '@/app/_components/container';
import AdminHeader from '@/app/admin/_components/admin-header';
import AdminSidebar from '@/app/admin/_components/admin-sidebar';
import { getAllEvents, addEvent, updateEvent, deleteEvent } from '@/lib/admin/event-service';
import type { Event } from '@/lib/events';

export default function AdminEventsPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({
    id: 0,
    title: '',
    date: '',
    location: '',
    description: '',
    requirements: '',
    fee: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/admin/login');
    } else if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn, isLoading, router]);
  
  const fetchEvents = async () => {
    const fetchedEvents = await getAllEvents();
    setEvents(fetchedEvents);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateEvent(currentEvent as Event);
      } else {
        await addEvent(currentEvent as Event);
      }
      
      // フォームをリセット
      setCurrentEvent({
        id: 0,
        title: '',
        date: '',
        location: '',
        description: '',
        requirements: '',
        fee: '',
      });
      setIsFormVisible(false);
      setIsEditing(false);
      fetchEvents();
    } catch (error) {
      console.error('イベントの保存中にエラーが発生しました:', error);
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
      }
    }
  };
  
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">イベント管理</h1>
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
            <div className="mb-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'イベントを編集' : '新規イベント作成'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">イベント名</label>
                  <input
                    type="text"
                    name="title"
                    value={currentEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">日付</label>
                  <input
                    type="date"
                    name="date"
                    value={currentEvent.date?.split('T')[0]}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">説明</label>
                  <textarea
                    name="description"
                    value={currentEvent.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded h-32 dark:bg-slate-700 dark:border-slate-600"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">参加要件</label>
                  <textarea
                    name="requirements"
                    value={currentEvent.requirements}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
                
                <div>
                  <label className="block mb-1">参加費</label>
                  <input
                    type="text"
                    name="fee"
                    value={currentEvent.fee}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    {isEditing ? '更新' : '作成'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-4">登録済みイベント</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg shadow">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="py-3 px-4 text-left">イベント名</th>
                    <th className="py-3 px-4 text-left">日付</th>
                    <th className="py-3 px-4 text-left">場所</th>
                    <th className="py-3 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="py-3 px-4">{event.title}</td>
                      <td className="py-3 px-4">{new Date(event.date).toLocaleDateString('ja-JP')}</td>
                      <td className="py-3 px-4">{event.location}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(event)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {events.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                登録されているイベントはありません
              </p>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
}