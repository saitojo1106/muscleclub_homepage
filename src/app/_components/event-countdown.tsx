// src/app/_components/event-countdown.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFutureEvents } from '@/lib/events';

export default function EventCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [nextEvent, setNextEvent] = useState(getFutureEvents()[0]); // 最も近いイベント
  
  useEffect(() => {
    if (!nextEvent) return;
    
    // 初回実行
    updateCountdown();
    
    const timer = setInterval(updateCountdown, 60000); // 1分ごとに更新
    
    return () => clearInterval(timer);
  }, [nextEvent]);
  
  const updateCountdown = () => {
    if (!nextEvent) return;
    
    const now = new Date();
    const eventDate = new Date(nextEvent.date);
    const diff = eventDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      setTimeLeft('イベント開催中！');
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    setTimeLeft(`${days}日 ${hours}時間 ${minutes}分`);
  };
  
  if (!nextEvent) {
    return null;
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