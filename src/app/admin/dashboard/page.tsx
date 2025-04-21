"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Container from '@/app/_components/container';
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 未認証の場合はログインページにリダイレクト
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // ローディング中
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // 認証済みでなければ何も表示しない
  if (!session) {
    return null;
  }

  return (
    <main>
      <Container>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            ログアウト
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/events"
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">イベント管理</h2>
            <p className="text-gray-600 dark:text-gray-400">
              イベントの追加・編集・削除
            </p>
          </Link>

          <Link
            href="/admin/posts"
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">ブログ管理</h2>
            <p className="text-gray-600 dark:text-gray-400">
              記事の投稿・編集・削除
            </p>
          </Link>

          <Link
            href="/admin/members"
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">部員管理</h2>
            <p className="text-gray-600 dark:text-gray-400">
              部員情報の追加・編集・削除
            </p>
          </Link>
        </div>
      </Container>
    </main>
  );
}