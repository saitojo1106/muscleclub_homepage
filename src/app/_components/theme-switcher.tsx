"use client";

import { useEffect, useState } from "react";

// カラースキーム設定のキー
const STORAGE_KEY = "theme";
type ColorSchemePreference = "dark" | "light" | "system";

export function ThemeSwitcher() {
  // 初期値はシステム設定
  const [theme, setTheme] = useState<ColorSchemePreference>("system");

  useEffect(() => {
    // クライアントサイドでのみ実行
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ColorSchemePreference;
    if (savedTheme) {
      setTheme(savedTheme);
      updateDOM(savedTheme);
    } else {
      // 初期設定
      updateDOM("system");
    }
  }, []);

  function updateDOM(preference: ColorSchemePreference) {
    const root = document.documentElement;
    
    // システム設定の場合はメディアクエリをチェック
    const isDark = 
      preference === "dark" || 
      (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    // DOMを更新
    root.classList[isDark ? "add" : "remove"]("dark");
    
    // 属性を設定
    root.setAttribute("data-mode", preference);
    
    // ローカルストレージに保存
    localStorage.setItem(STORAGE_KEY, preference);
  }

  function toggleTheme() {
    // system -> dark -> light -> system の順でトグル
    const nextTheme: Record<ColorSchemePreference, ColorSchemePreference> = {
      system: "dark",
      dark: "light",
      light: "system"
    };
    
    const newTheme = nextTheme[theme];
    setTheme(newTheme);
    updateDOM(newTheme);
  }

  return (
    <button
      suppressHydrationWarning
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="テーマを切り替える"
    >
      {theme === "light" && "☀️"}
      {theme === "dark" && "🌙"}
      {theme === "system" && "🌓"}
    </button>
  );
}

// FOUCを防ぐためのスクリプト
export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var key = "${STORAGE_KEY}";
              var preference = localStorage.getItem(key) || "system";
              var isDark = preference === "dark" || 
                          (preference === "system" && 
                           window.matchMedia("(prefers-color-scheme: dark)").matches);
              
              document.documentElement.classList[isDark ? "add" : "remove"]("dark");
              document.documentElement.setAttribute("data-mode", preference);
            } catch (e) {
              console.error("テーマの適用中にエラーが発生しました:", e);
            }
          })();
        `,
      }}
    />
  );
}

export default function ThemeSwitcherWithScript() {
  return (
    <>
      <ThemeScript />
      <ThemeSwitcher />
    </>
  );
}
