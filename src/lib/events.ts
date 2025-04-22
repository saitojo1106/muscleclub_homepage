import { supabase } from './supabase';

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  requirements?: string;
  fee?: string;
};

// すべてのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('イベント取得エラー:', error);
    return [];
  }
  
  return data || [];
}

// 将来のイベントを取得
export async function getFutureEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('イベント取得エラー:', error);
    return [];
  }
  
  return data || [];
}

// IDでイベントを取得
export async function getEventById(id: number): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`ID ${id} のイベント取得エラー:`, error);
    return null;
  }
  
  return data;
}

// イベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();
  
  if (error) {
    console.error('イベント追加エラー:', error);
    return null;
  }
  
  return data;
}

// イベントを更新
export async function updateEvent(event: Event): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', event.id)
    .select()
    .single();
  
  if (error) {
    console.error(`ID ${event.id} のイベント更新エラー:`, error);
    return null;
  }
  
  return data;
}

// イベントを削除
export async function deleteEvent(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`ID ${id} のイベント削除エラー:`, error);
    return false;
  }
  
  return true;
}