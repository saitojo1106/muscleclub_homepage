import { supabase } from './supabase';

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  requirements?: string;
  fee?: string;
  image_url?: string;
};

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
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
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

// IDでイベントを取得
export async function getEventById(id: number): Promise<Event | null> {
  try {
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
  } catch (error) {
    console.error(`イベント取得中にエラーが発生しました:`, error);
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
    
    if (error) {
      console.error('イベント追加エラー:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('イベント追加中にエラーが発生しました:', error);
    return null;
  }
}

// イベントを更新
export async function updateEvent(id: number, updates: Partial<Omit<Event, 'id'>>): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`ID ${id} のイベント更新エラー:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`イベント更新中にエラーが発生しました:`, error);
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
    
    if (error) {
      console.error(`ID ${id} のイベント削除エラー:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`イベント削除中にエラーが発生しました:`, error);
    return false;
  }
}
