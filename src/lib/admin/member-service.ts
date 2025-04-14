import type { Member } from '@/app/admin/members/page'; // 型定義をインポート

// ローカルストレージを使用したシンプルな実装
// 本番環境では実際のAPIを使用する
const STORAGE_KEY = 'muscle_club_members';

// 全ての部員を取得
export async function getAllMembers(): Promise<Member[]> {
  if (typeof window === 'undefined') return [];
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return [];
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('部員データの取得中にエラーが発生しました:', error);
    return [];
  }
}

// 単一の部員を取得
export async function getMemberById(id: number): Promise<Member | null> {
  const members = await getAllMembers();
  return members.find(member => member.id === id) || null;
}

// 新しい部員を追加
export async function addMember(member: Omit<Member, 'id'>): Promise<Member> {
  const members = await getAllMembers();
  
  // 新しいIDを生成
  const maxId = members.reduce((max, member) => Math.max(max, member.id), 0);
  const newMember = { ...member, id: maxId + 1 };
  
  const updatedMembers = [...members, newMember];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMembers));
  
  return newMember;
}

// 部員情報を更新
export async function updateMember(member: Member): Promise<Member> {
  const members = await getAllMembers();
  const index = members.findIndex(m => m.id === member.id);
  
  if (index === -1) {
    throw new Error(`ID ${member.id} の部員が見つかりません`);
  }
  
  members[index] = member;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  
  return member;
}

// 部員を削除
export async function deleteMember(id: number): Promise<void> {
  const members = await getAllMembers();
  const updatedMembers = members.filter(member => member.id !== id);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMembers));
}

// サンプルデータをロード（開発用）
export async function loadSampleData(): Promise<Member[]> {
  const sampleMembers: Member[] = [
    {
      id: 1,
      name: '山田 太郎',
      position: '部長',
      year: '3年',
      description: 'ボディビル3年目。全国大会出場経験あり。',
      image: '/assets/members/sample1.jpg'
    },
    {
      id: 2,
      name: '佐藤 花子',
      position: '副部長',
      year: '2年',
      description: 'フィジーク競技が専門。地方大会で準優勝。',
      image: '/assets/members/sample2.jpg'
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleMembers));
  return sampleMembers;
}