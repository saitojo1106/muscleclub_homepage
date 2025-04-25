import { supabase } from '../supabase';
import type { Member } from '@/types';

// すべてのメンバーを取得
export async function getAllMembers(): Promise<Member[]> {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('メンバー取得エラー:', error);
    return [];
  }
}

// IDでメンバーを取得
export async function getMemberById(id: number): Promise<Member | null> {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`メンバー取得エラー (ID: ${id}):`, error);
    return null;
  }
}

// 新しいメンバーを追加
export async function addMember(member: Omit<Member, 'id'>): Promise<Member | null> {
  try {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('メンバー追加エラー:', error);
    return null;
  }
}

// メンバーを更新
export async function updateMember(id: number, updates: Partial<Member>): Promise<Member | null> {
  try {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`メンバー更新エラー (ID: ${id}):`, error);
    return null;
  }
}

// メンバーを削除
export async function deleteMember(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`メンバー削除エラー (ID: ${id}):`, error);
    return false;
  }
}