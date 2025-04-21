// src/lib/admin/event-service.ts
import type { Event } from '@/lib/events';

const STORAGE_KEY = 'muscleclub_events';

// 全てのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  // ブラウザ環境でない場合は空の配列を返す（SSRなどの場合）
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  return JSON.parse(storedData);
}

// 新しいイベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const events = await getAllEvents();
  
  // 新しいIDを生成
  const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
  const newEvent = { ...event, id: maxId + 1 };
  
  const updatedEvents = [...events, newEvent];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  
  return newEvent;
}

// イベントを更新
export async function updateEvent(updatedEvent: Event): Promise<Event> {
  const events = await getAllEvents();
  
  const updatedEvents = events.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  
  return updatedEvent;
}

// イベントを削除
export async function deleteEvent(id: number): Promise<void> {
  const events = await getAllEvents();
  
  const filteredEvents = events.filter(event => event.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
}