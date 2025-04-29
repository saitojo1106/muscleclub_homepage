'use client';

import { useState } from 'react';
import { useRealtimeSubscription } from '@/lib/hooks/useRealtimeSubscription';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * A component that demonstrates real-time event updates from Supabase
 */
export default function RealtimeEvents() {
  // Use our custom hook to subscribe to events table changes
  const { data: events, loading, error, refresh } = useRealtimeSubscription({
    table: 'events',
    eventTypes: ['INSERT', 'UPDATE', 'DELETE'],
    onInsert: (payload) => {
      console.log('Event added:', payload.new);
    },
    onUpdate: (payload) => {
      console.log('Event updated:', payload.new);
    },
    onDelete: (payload) => {
      console.log('Event deleted:', payload.old);
    },
  });

  // State for the form to add new events
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Handle form submission to add a new event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      alert('タイトル、日付、開催場所は必須です');
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('events').insert([newEvent]);
      
      if (error) throw error;
      
      // Reset form
      setNewEvent({
        title: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
      });
      
      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('イベント追加エラー:', error);
      alert('イベントの追加に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle updating an event
  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('events')
        .update({
          title: selectedEvent.title,
          date: selectedEvent.date,
          location: selectedEvent.location,
          description: selectedEvent.description,
        })
        .eq('id', selectedEvent.id);
      
      if (error) throw error;
      
      // Reset selected event
      setSelectedEvent(null);
      
      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('イベント更新エラー:', error);
      alert('イベントの更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting an event
  const handleDeleteEvent = async (id: number) => {
    if (!confirm('このイベントを削除してもよろしいですか？')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      
      if (error) throw error;
      
      // The real-time subscription will automatically update the UI
    } catch (error) {
      console.error('イベント削除エラー:', error);
      alert('イベントの削除に失敗しました');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
    } catch (e) {
      return dateString;
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">リアルタイムイベント管理</h1>
      <p className="mb-6 text-gray-600">
        このコンポーネントはSupabaseのリアルタイムサブスクリプションを使用しています。
        イベントが追加、更新、削除されると、自動的に画面が更新されます。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Event list */}
        <div>
          <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded text-center">
              イベントがありません
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(event.date)} @ {event.location}
                  </p>
                  {event.description && (
                    <p className="mt-2 text-sm">{event.description}</p>
                  )}
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => setSelectedEvent(event as Event)}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
          >
            手動更新
          </button>
        </div>

        {/* Add/Edit form */}
        <div>
          {selectedEvent ? (
            <>
              <h2 className="text-xl font-semibold mb-4">イベントを編集</h2>
              <form onSubmit={handleUpdateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    日付
                  </label>
                  <input
                    type="date"
                    value={selectedEvent.date.split('T')[0]}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    開催場所
                  </label>
                  <input
                    type="text"
                    value={selectedEvent.location}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, location: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    説明
                  </label>
                  <textarea
                    value={selectedEvent.

"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types'; // 修正後: 正しいパスからイベント型をインポート

export default function RealtimeEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // 初期データを取得
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (data) {
        setEvents(data);
      }
    };

    fetchEvents();

    // リアルタイムサブスクリプションを設定
    const subscription = supabase
      .channel('events-channel')
      .on('postgres_changes', 
        { 
          event: '*', // INSERT, UPDATE, DELETEの全てを監視
          schema: 'public', 
          table: 'events' 
        }, 
        (payload) => {
          console.log('変更が検出されました:', payload);
          
          // 変更タイプに応じて状態を更新
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new as Event]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => 
              prev.map(event => 
                event.id === payload.new.id ? payload.new as Event : event
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => 
              prev.filter(event => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>リアルタイム更新されるイベント一覧</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} - {new Date(event.date).toLocaleDateString('ja-JP')}
          </li>
        ))}
      </ul>
    </div>
  );
}