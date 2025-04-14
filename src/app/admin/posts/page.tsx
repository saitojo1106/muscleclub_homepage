"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from '@/app/_components/container';
import Link from 'next/link';
import { getAllPosts } from '@/lib/api';

type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
};

export default function PostsAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 認証チェック - NextAuth
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status, router]);
  
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('記事の取得中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 記事を削除する関数（MDファイルを削除する実装が必要）
  const handleDelete = (slug: string) => {
    if (window.confirm('この記事を削除してもよろしいですか？')) {
      // 削除ロジックを実装（今後のタスク）
      alert('削除機能は現在開発中です。今後のアップデートをお待ちください。');
    }
  };
  
  // 記事を編集する関数
  const handleEdit = (slug: string) => {
    // 編集ページへリダイレクト（今後のタスク）
    alert('編集機能は現在開発中です。今後のアップデートをお待ちください。');
  };
  
  // ローディング中
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  // 未認証の場合は何も表示しない
  if (!session) {
    return null;
  }
  
  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ブログ管理</h1>
          <Link href="/admin/dashboard" className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            ダッシュボードへ戻る
          </Link>
        </div>
        
        <div className="mb-6 flex justify-end">
          <Link href="/admin/posts/new" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            新規記事作成
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p>記事を読み込み中...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <p className="text-center">記事がありません。「新規記事作成」から記事を追加してください。</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">記事一覧</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700">
                    <th className="py-3 px-4 text-left">タイトル</th>
                    <th className="py-3 px-4 text-left">公開日</th>
                    <th className="py-3 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="py-3 px-4">{post.title}</td>
                      <td className="py-3 px-4">{new Date(post.date).toLocaleDateString('ja-JP')}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(post.slug)} className="text-blue-500 hover:text-blue-700">編集</button>
                          <button onClick={() => handleDelete(post.slug)} className="text-red-500 hover:text-red-700">削除</button>
                          <Link href={`/posts/${post.slug}`} target="_blank" className="text-green-500 hover:text-green-700">表示</Link>
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
            現在、記事の表示のみ実装されています。編集・削除機能は開発中です。
          </p>
          <p className="text-amber-700 dark:text-amber-300">
            実装予定の機能: <br />
            - マークダウンエディタによる記事作成 <br />
            - 画像アップロード <br />
            - 記事のプレビュー <br />
            - 公開/非公開設定
          </p>
        </div>
      </Container>
    </main>
  );
}