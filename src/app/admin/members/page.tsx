"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from '@/app/_components/container';
import Link from 'next/link';
import { getAllMembers, addMember, updateMember, deleteMember, loadSampleData } from '@/lib/admin/member-service';

// 部員の型定義（エクスポートして他ファイルからも使用可能に）
export type Member = {
  id: number;
  name: string;
  position: string;
  year: string;
  description: string;
  image?: string;
};

export default function MembersAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    // 認証チェック - NextAuth
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      fetchMembers();
    }
  }, [status, router]);
  
  const fetchMembers = async () => {
    try {
      let memberData = await getAllMembers();
      
      // データがない場合はサンプルデータをロード
      if (memberData.length === 0) {
        memberData = await loadSampleData();
      }
      
      setMembers(memberData);
    } catch (error) {
      console.error('部員データの取得中にエラーが発生しました:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateMember(currentMember);
      } else {
        // idを除外したオブジェクトをaddMemberに渡す
        const { id, ...memberWithoutId } = currentMember;
        await addMember(memberWithoutId);
      }
      
      setIsFormVisible(false);
      fetchMembers();
    } catch (error) {
      console.error('部員データの保存中にエラーが発生しました:', error);
      alert('エラーが発生しました。詳細はコンソールを確認してください。');
    }
  };
  
  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setIsEditing(true);
    setIsFormVisible(true);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('この部員情報を削除してもよろしいですか？')) {
      try {
        await deleteMember(id);
        fetchMembers();
      } catch (error) {
        console.error('部員の削除中にエラーが発生しました:', error);
        alert('エラーが発生しました。詳細はコンソールを確認してください。');
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentMember({ ...currentMember, [name]: value });
  };
  
  // ローディング中の表示
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  // 未認証の場合は何も表示しない（useEffectでリダイレクト処理をしているため）
  if (!session) {
    return null;
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">部員管理</h1>
          <Link href="/admin/dashboard" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            ダッシュボードへ戻る
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
                  value={currentMember.image || ''}
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
            基本的なCRUD操作機能が実装されました。データはブラウザのローカルストレージに保存されます。
          </p>
          <p className="text-amber-700 dark:text-amber-300">
            今後の拡張予定: <br />
            - バックエンドAPIとの連携 <br />
            - 画像アップロード機能 <br />
            - 部員の並び順設定
          </p>
        </div>
      </Container>
    </main>
  );
}