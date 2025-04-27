"use client";

// 必要なインポート
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AdminHeader from '../_components/admin-header';
import { isAuthenticated, login, logout, getUser } from '@/lib/auth';
import { getAllEvents, addEvent, updateEvent, deleteEvent } from '@/lib/api/events';
import type { Event } from '@/types';
import ImageUpload from '@/app/_components/image-upload';
import Image from 'next/image';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    requirements: '',
    fee: '',
    image_url: '' // 画像URL用のフィールド追加
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  // イベント一覧を取得
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (error) {
        console.error('イベント取得エラー:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // 編集モード
        const updated = await updateEvent(editingId, formData);
        if (updated) {
          setEvents(events.map(event => 
            event.id === editingId ? { ...event, ...updated } : event
          ));
          resetForm();
        }
      } else {
        // 新規追加モード
        const newEvent = await addEvent(formData);
        if (newEvent) {
          setEvents([...events, newEvent]);
          resetForm();
        }
      }
    } catch (error) {
      console.error('イベント保存エラー:', error);
    }
  };

  // 削除処理
  const handleDelete = async (id: number) => {
    if (window.confirm('このイベントを削除してもよろしいですか？')) {
      try {
        const success = await deleteEvent(id);
        if (success) {
          setEvents(events.filter(event => event.id !== id));
        }
      } catch (error) {
        console.error('イベント削除エラー:', error);
      }
    }
  };

  // 編集モード開始
  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description || '',
      requirements: event.requirements || '',
      fee: event.fee || '',
      image_url: event.image_url || '' // 画像URL用のフィールド追加
    });
  };

  // フォームリセット
  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      requirements: '',
      fee: '',
      image_url: '' // 画像URL用のフィールド追加
    });
    setEditingId(null);
  };

  // 入力フィールド変更時
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <AdminHeader />
      <h1 className="text-2xl font-bold mb-6">イベント管理</h1>
      
      {/* イベントフォーム */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl mb-4">{editingId ? 'イベントを編集' : '新しいイベントを追加'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">タイトル</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">日付</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">場所</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1">参加費</label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block mb-1">説明</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mt-4">
          <label className="block mb-1">参加要件</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={2}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1">画像URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="mt-4 flex gap-2">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingId ? '更新する' : '追加する'}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
      
      {/* イベント一覧 */}
      <h2 className="text-xl mb-4">イベント一覧</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">タイトル</th>
              <th className="p-2 text-left">日付</th>
              <th className="p-2 text-left">場所</th>
              <th className="p-2 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} className="border-b">
                <td className="p-2">{event.title}</td>
                <td className="p-2">{new Date(event.date).toLocaleDateString('ja-JP')}</td>
                <td className="p-2">{event.location}</td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => handleEdit(event)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded mr-2"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
            
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  イベントがありません。新しいイベントを追加してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}