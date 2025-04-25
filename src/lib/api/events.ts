// src/lib/api/events.ts
import { supabase } from '../supabase';
import type { Event, Entity } from '@/types'; // Entityをインポートに追加

// すべてのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('イベント取得エラー:', error);
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
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('イベント取得エラー:', error);
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

// すべてのエンティティを取得
export async function getAll(): Promise<Entity[]> {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('データ取得エラー:', error);
    return [];
  }
}

// 特定のIDのエンティティを取得
export async function getById(id: number): Promise<Entity | null> {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`ID ${id} のデータ取得エラー:`, error);
    return null;
  }
}

// 新しいエンティティを追加
export async function add(entity: Omit<Entity, 'id'>): Promise<Entity | null> {
  try {
    const { data, error } = await supabase
      .from('entities')
      .insert([entity])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('データ追加エラー:', error);
    return null;
  }
}

// エンティティを更新
export async function update(id: number, updates: Partial<Omit<Entity, 'id'>>): Promise<Entity | null> {
  try {
    const { data, error } = await supabase
      .from('entities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`データ更新エラー (ID: ${id}):`, error);
    return null;
  }
}

// エンティティを削除
export async function remove(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('entities')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`データ削除エラー (ID: ${id}):`, error);
    return false;
  }
}