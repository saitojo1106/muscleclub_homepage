import type { Event } from '@/lib/events';

// ローカルストレージを使用したシンプルな実装
// 本番環境では実際のAPIを使用する

const STORAGE_KEY = 'muscle_club_events';

// 全てのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('イベントの取得中にエラーが発生しました:', error);
    return [];
  }
}

// 単一のイベントを取得
export async function getEventById(id: number): Promise<Event | null> {
  const events = await getAllEvents();
  return events.find(event => event.id === id) || null;
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
export async function updateEvent(event: Event): Promise<Event> {
  const events = await getAllEvents();
  const index = events.findIndex(e => e.id === event.id);
  
  if (index === -1) {
    throw new Error(`ID ${event.id} のイベントが見つかりません`);
  }
  
  events[index] = event;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  
  return event;
}

// イベントを削除
export async function deleteEvent(id: number): Promise<void> {
  const events = await getAllEvents();
  const updatedEvents = events.filter(event => event.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
}