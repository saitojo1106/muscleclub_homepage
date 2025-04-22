"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types/database';

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