"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    // 既に認証されている場合はダッシュボードにリダイレクト
    if (isAuthenticated()) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (login(username, password)) {
      router.push('/admin/dashboard');
    } else {
      setError("ユーザー名またはパスワードが間違っています");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">マッスルクラブ 管理画面</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            ログインして管理機能を利用する
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              ユーザー名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 dark:border-gray-600 dark:bg-slate-700 rounded-md"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              ログイン
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            ホームページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}