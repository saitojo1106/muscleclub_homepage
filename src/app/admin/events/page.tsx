// src/app/admin/events/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AdminHeader from '../_components/admin-header';
import { isAuthenticated } from '@/lib/authUtils';

// イベント型定義
type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  requirements?: string;
  fee?: string;
};

// ローカルストレージのキー
const LOCAL_STORAGE_KEY = 'muscle_club_events';

export default function EventsManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
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

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    
    // データの初期ロード
    const loadEvents = () => {
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          setEvents(JSON.parse(storedData));
        } else {
          // サンプルデータをロード
          const sampleEvents = [
            {
              id: 1,
              title: "マッスルゲート仙台2024",
              date: "2024-08-15",
              location: "仙台電力ホール",
              description: "全国から集まった学生ボディビルダーたちとの熱い戦いです。",
              requirements: "参加には事前登録が必要です。",
              fee: "観覧料: 2,000円、参加費: 5,000円",
            },
            {
              id: 2,
              title: "初心者向けトレーニング講座",
              date: "2024-09-10",
              location: "オンライン",
              description: "筋トレ初心者向けの基礎講座です。",
              requirements: "どなたでも参加いただけます",
              fee: "参加費: 1,000円",
            }
          ];
          
          setEvents(sampleEvents);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleEvents));
        }
        setLoading(false);
      } catch (error) {
        console.error('イベントデータの読み込みエラー:', error);
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [router]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // イベントの更新
      const updatedEvents = events.map(event => 
        event.id === currentEvent.id ? currentEvent : event
      );
      setEvents(updatedEvents);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));
    } else {
      // 新しいイベントの追加
      const newEvent = {
        ...currentEvent,
        id: Date.now(), // 簡易的なID生成
      };
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));
    }
    
    // フォームのリセット
    setCurrentEvent({
      id: 0,
      title: '',
      date: '',
      location: '',
      description: '',
      requirements: '',
      fee: '',
    });
    setIsEditing(false);
  };

  const handleEdit = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('このイベントを削除してもよろしいですか？')) {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <AdminHeader />
      
      <div className="container mx-auto px-5 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">イベント管理</h1>
          <button 
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            ダッシュボードに戻る
          </button>
        </div>
        
        {/* イベント入力フォーム */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'イベントを編集' : '新しいイベントを追加'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">タイトル</label>
              <input
                type="text"
                name="title"
                value={currentEvent.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">日付</label>
              <input
                type="date"
                name="date"
                value={currentEvent.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">場所</label>
              <input
                type="text"
                name="location"
                value={currentEvent.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">説明</label>
              <textarea
                name="description"
                value={currentEvent.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">参加要件</label>
              <input
                type="text"
                name="requirements"
                value={currentEvent.requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">参加費</label>
              <input
                type="text"
                name="fee"
                value={currentEvent.fee}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {isEditing ? '更新' : '追加'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentEvent({
                      id: 0,
                      title: '',
                      date: '',
                      location: '',
                      description: '',
                      requirements: '',
                      fee: '',
                    });
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  キャンセル
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* イベント一覧 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
            
            {events.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                登録されたイベントはありません
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="py-2 text-left">タイトル</th>
                      <th className="py-2 text-left">日付</th>
                      <th className="py-2 text-left">場所</th>
                      <th className="py-2 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b dark:border-gray-700">
                        <td className="py-3">{event.title}</td>
                        <td className="py-3">{event.date}</td>
                        <td className="py-3">{event.location}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleEdit(event)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded mr-2 hover:bg-yellow-600 transition-colors"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}