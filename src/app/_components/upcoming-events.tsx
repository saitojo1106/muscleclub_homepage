"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event, getFutureEvents } from '@/lib/events';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Supabaseから未来のイベントを取得
        const futureEvents = await getFutureEvents();
        // 最大3件を表示
        setEvents(futureEvents.slice(0, 3));
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
    return null;
  }
  
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">今後のイベント</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
            <h3 className="font-bold text-lg">{event.title}</h3>
            <p>日時: {new Date(event.date).toLocaleDateString('ja-JP')}</p>
            <p>場所: {event.location}</p>
            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="mt-2 rounded"
                width={300}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            )}
            <Link href={`/events/${event.id}`}>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                詳細を見る
              </button>
            </Link>
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