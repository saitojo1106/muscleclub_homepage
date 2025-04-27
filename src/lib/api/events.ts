import { supabase } from '@/lib/supabase';
import type { Event } from '@/types';

// すべてのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('イベント取得エラー:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('イベント取得中にエラーが発生しました:', error);
    return [];
  }
}

// 将来のイベントを取得
export async function getFutureEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('将来のイベント取得エラー:', error);
    return [];
  }
}

// IDでイベントを取得
export async function getEventById(id: number): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`イベント取得エラー (ID: ${id}):`, error);
    return null;
  }
}

// 新しいイベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('イベント追加エラー:', error);
    return null;
  }
}

// イベントを更新
export async function updateEvent(id: number, updates: Partial<Event>): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`イベント更新エラー (ID: ${id}):`, error);
    return null;
  }
}

// イベントを削除
export async function deleteEvent(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`イベント削除エラー (ID: ${id}):`, error);
    return false;
  }
}
