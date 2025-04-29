// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/admin/dashboard";

  useEffect(() => {
    const handleCallback = async () => {
      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Code exchange error:", error);
            router.push(`/admin/login?error=${encodeURIComponent('認証に失敗しました')}`);
            return;
          }
        } catch (err) {
          console.error("Auth callback error:", err);
          router.push(`/admin/login?error=${encodeURIComponent('認証に失敗しました')}`);
          return;
        }
      }
      router.push(next);
    };

    handleCallback();
  }, [code, router, next]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-lg text-gray-600 dark:text-gray-300">認証処理中...</p>
    </div>
  );
}