"use client";

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Container from '@/app/_components/container';
import Link from 'next/link';
import { getAllMembers, addMember, updateMember, deleteMember, loadSampleData } from '@/lib/admin/member-service';
import { isAuthenticated } from '@/lib/auth';
import type { Member } from '@/types';

export default function MembersAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login");
      return;
    }
    setLoading(false);
    fetchMembers();
  }, [router]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const allMembers = await getAllMembers();
      setMembers(allMembers);
    } catch (error) {
      console.error('メンバーの取得中にエラーが発生しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // 数値型の id を受け取るように修正
  const handleDelete = (id: number) => {
    if (window.confirm('このメンバーを削除してもよろしいですか？')) {
      alert('削除機能は現在開発中です。今後のアップデートをお待ちください。');
    }
  };

  // 数値型の id を受け取るように修正
  const handleEdit = (id: number) => {
    alert('編集機能は現在開発中です。今後のアップデートをお待ちください。');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">メンバー管理</h1>
          <Link href="/admin/dashboard" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            ダッシュボードへ戻る
          </Link>
        </div>
        
        <div className="mb-6 flex justify-end">
          <Link href="/admin/members/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            新規メンバー作成
          </Link>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p>メンバーを読み込み中...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <p className="text-center">メンバーがいません。「新規メンバー作成」からメンバーを追加してください。</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">メンバー一覧</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700">
                    <th className="py-3 px-4 text-left">名前</th>
                    <th className="py-3 px-4 text-left">役職</th>
                    <th className="py-3 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="py-3 px-4">{member.name}</td>
                      <td className="py-3 px-4">{member.role}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(member.id)} className="text-blue-500 hover:text-blue-700">編集</button>
                          <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700">削除</button>
                          <Link href={`/members/${member.id}`} target="_blank" className="text-green-500 hover:text-green-700">表示</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">開発メモ</h3>
          <p className="text-amber-700 dark:text-amber-300 mb-2">
            現在、メンバーの表示のみ実装されています。編集・削除機能は開発中です。
          </p>
          <p className="text-amber-700 dark:text-amber-300">
            実装予定の機能: <br />
            - メンバーの役職編集 <br />
            - 画像アップロード <br />
            - メンバーのプレビュー <br />
            - 公開/非公開設定
          </p>
        </div>
      </Container>
    </main>
  );
}