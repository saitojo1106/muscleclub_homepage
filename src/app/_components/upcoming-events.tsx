"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event, getAllEvents } from '@/lib/events';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await getAllEvents();
        // 未来のイベントのみを表示、日付順に並び替え
        const now = new Date();
        const futureEvents = allEvents
          .filter(event => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3); // 最大3件表示
        
        setEvents(futureEvents);
      } catch (error) {
        console.error('イベント取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, []);
  
  if (loading) {
    return <div className="my-12 text-center">イベント情報を読み込み中...</div>;
  }
  
  if (events.length === 0) {
    return null; // イベントがない場合は何も表示しない
  }
  
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">今後のイベント</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <div className="text-gray-600 dark:text-gray-300 mb-2">
                📅 {new Date(event.date).toLocaleDateString('ja-JP')}
              </div>
              <div className="text-gray-600 dark:text-gray-300 mb-4">
                📍 {event.location}
              </div>
              <p className="text-gray-700 dark:text-gray-400 mb-4 line-clamp-3">
                {event.description}
              </p>
              <button 
                onClick={() => {
                  // モーダルで詳細表示するか、イベント詳細ページができるまでは単純なアラート
                  alert(`${event.title}\n\n日時: ${new Date(event.date).toLocaleDateString('ja-JP')}\n場所: ${event.location}\n\n${event.description}`);
                }}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                詳細を見る
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link 
          href="/events"
          className="inline-block text-blue-600 hover:underline"
        >
          すべてのイベントを見る
        </Link>
      </div>
    </section>
  );
}