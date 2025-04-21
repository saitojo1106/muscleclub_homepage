"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Container from '@/app/_components/container';
import Header from "@/app/_components/header";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ユーザー名またはパスワードが間違っています");
      } else {
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError("ログイン中にエラーが発生しました");
    }
  };

  return (
    <main>
      <Container>
        <Header />
        <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">管理者ログイン</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">ユーザー名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
            <div>
              <label className="block mb-1">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      </Container>
    </main>
  );
}