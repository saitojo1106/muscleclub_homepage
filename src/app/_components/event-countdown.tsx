// src/app/_components/event-countdown.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event, getFutureEvents } from '@/lib/events';

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [nextEvent, setNextEvent] = useState<Event | null>(null); // 型を明示的に指定
  
  useEffect(() => {
    // 将来のイベントを非同期で取得
    const loadNextEvent = async () => {
      try {
        const futureEvents = await getFutureEvents();
        if (futureEvents.length > 0) {
          setNextEvent(futureEvents[0]); // 最も近いイベント
        }
      } catch (error) {
        console.error('イベント取得エラー:', error);
      }
    };
    
    loadNextEvent();
  }, []);
  
  useEffect(() => {
    if (!nextEvent) return;
    
    // カウントダウン機能の実装
    const calculateTimeLeft = () => {
      const eventDate = new Date(nextEvent.date);
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft('イベントは開始しました！');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`);
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [nextEvent]);
  
  if (!nextEvent) {
    return null; // イベントが読み込まれるまで何も表示しない
  }
  
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">次回イベント</h2>
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{nextEvent.title}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {new Date(nextEvent.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
        <p className="text-gray-600 dark:text-gray-300">場所: {nextEvent.location}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-4 rounded mb-4">
        <p className="text-lg">開始まであと</p>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{timeLeft}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link 
          href={`/events/${nextEvent.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          詳細を見る
        </Link>
        <Link 
          href="/events"
          className="border border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded transition-colors"
        >
          すべてのイベント
        </Link>
      </div>
    </div>
  );
}