// src/lib/admin/event-service.ts を新規作成またはパス参照修正
// 既存のイベントサービスをインポートして再エクスポート
import { 
  getAllEvents as getEvents, 
  defaultEvents 
} from '@/lib/events';

export type { Event } from '@/lib/events';

// 全てのイベントを取得
export async function getAllEvents() {
  return getEvents();
}

// 新しいイベントを追加
export async function addEvent(event) {
  const events = getEvents();
  const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
  const newEvent = { ...event, id: maxId + 1 };
  
  if (typeof window !== 'undefined') {
    const updatedEvents = [...events, newEvent];
    localStorage.setItem('muscle_club_events', JSON.stringify(updatedEvents));
  }
  
  return newEvent;
}

// イベントを更新
export async function updateEvent(updatedEvent) {
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
export async function deleteEvent(id) {
  const events = getEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(filteredEvents));
  }
}

// サンプルデータロード
export async function loadSampleData() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(defaultEvents));
  }
  
  return defaultEvents;
}