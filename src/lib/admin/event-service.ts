// src/lib/admin/event-service.ts
import { Event, getAllEvents as getEvents } from '@/lib/events';

// 全てのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  return getEvents();
}

// 新しいイベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const events = getEvents();
  
  // 新しいIDを生成
  const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
  const newEvent = { ...event, id: maxId + 1 };
  
  const updatedEvents = [...events, newEvent];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(updatedEvents));
  }
  
  return newEvent;
}

// イベントを更新
export async function updateEvent(updatedEvent: Event): Promise<Event> {
  const events = getEvents();
  
  const updatedEvents = events.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(updatedEvents));
  }
  
  return updatedEvent;
}

// イベントを削除
export async function deleteEvent(id: number): Promise<void> {
  const events = getEvents();
  
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(filteredEvents));
  }
}