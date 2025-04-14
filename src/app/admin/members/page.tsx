"use client";

import { useState, useEffect } from 'react';
import Container from '@/app/_components/container';
import Link from 'next/link';

// 部員の型定義
type Member = {
  id: number;
  name: string;
  position: string;
  year: string;
  description: string;
  image?: string;
};

// サンプルデータ
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

export default function MembersAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member>({
    id: 0,
    name: '',
    position: '',
    year: '',
    description: '',
    image: ''
  });
  
  useEffect(() => {
    // 認証チェック
    const auth = localStorage.getItem('admin_auth');
    if (auth !== 'true') {
      window.location.href = '/admin';
      return;
    }
    setIsAuthenticated(true);
    
    // サンプルデータの読み込み
    // 実際のアプリでは、APIやlocalStorageからデータを取得
    setMembers(sampleMembers);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 現在はアラートを表示するだけ
    alert('保存機能は現在開発中です。今後のアップデートをお待ちください。');
    
    setIsFormVisible(false);
  };
  
  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setIsEditing(true);
    setIsFormVisible(true);
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('この部員情報を削除してもよろしいですか？')) {
      // 現在はアラートを表示するだけ
      alert('削除機能は現在開発中です。今後のアップデートをお待ちください。');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMember({ ...currentMember, [name]: value });
  };
  
  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">部員管理</h1>
          <Link href="/admin" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            管理画面トップへ戻る
          </Link>
        </div>
        
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              setIsFormVisible(true);
              setIsEditing(false);
              setCurrentMember({
                id: 0,
                name: '',
                position: '',
                year: '',
                description: '',
                image: ''
              });
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            新規部員登録
          </button>
        </div>
        
        {isFormVisible && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">{isEditing ? '部員情報を編集' : '新規部員登録'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">名前</label>
                <input
                  type="text"
                  name="name"
                  value={currentMember.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1">役職</label>
                <input
                  type="text"
                  name="position"
                  value={currentMember.position}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                />
              </div>
              
              <div>
                <label className="block mb-1">学年</label>
                <select
                  name="year"
                  value={currentMember.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="4年">4年</option>
                  <option value="大学院">大学院</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1">自己紹介</label>
                <textarea
                  name="description"
                  value={currentMember.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block mb-1">プロフィール画像</label>
                <input
                  type="text"
                  name="image"
                  value={currentMember.image}
                  onChange={handleChange}
                  placeholder="画像のURLを入力（開発中）"
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                />
                <p className="text-sm text-gray-500 mt-1">※画像アップロード機能は開発中です</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? '更新' : '登録'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">部員一覧</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="py-3 px-4 text-left">名前</th>
                  <th className="py-3 px-4 text-left">役職</th>
                  <th className="py-3 px-4 text-left">学年</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.position}</td>
                    <td className="py-3 px-4">{member.year}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(member)} className="text-blue-500 hover:text-blue-700">編集</button>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700">削除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">開発メモ</h3>
          <p className="text-amber-700 dark:text-amber-300 mb-2">
            現在は表示機能のみ実装されています。実際のデータ保存・編集・削除機能は開発中です。
          </p>
          <p className="text-amber-700 dark:text-amber-300">
            実装予定の機能: <br />
            - データの永続化 (API連携やローカルストレージ) <br />
            - 画像アップロード機能 <br />
            - 部員の並び順設定
          </p>
        </div>
      </Container>
    </main>
  );
}