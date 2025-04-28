"use client";

import { useEffect, useState } from "react";
import styles from './theme-switcher.module.css';

// カラースキーム設定のキー
const STORAGE_KEY = "theme";
type ColorScheme = "dark" | "light";

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // マウント時の初期化
  useEffect(() => {
    setIsMounted(true);
    
    // クライアントサイドでのみ実行
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // 保存された設定かシステム設定を使用
    const shouldBeDark = savedTheme === "dark" || (savedTheme !== "light" && prefersDark);
    
    setIsDark(shouldBeDark);
    updateDOM(shouldBeDark);
    
    // システム設定の変更を監視
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        updateDOM(e.matches);
        setIsDark(e.matches);
      }
    };
    
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  function updateDOM(dark: boolean) {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    updateDOM(newIsDark);
    localStorage.setItem(STORAGE_KEY, newIsDark ? "dark" : "light");
  }

  // SSRでのレンダリング時は何も表示しない
  if (!isMounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className={styles.switch}
      aria-label="テーマを切り替える"
    >
      {/* アイコンはCSSで制御 */}
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
              var savedTheme = localStorage.getItem(key);
              var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              
              var isDark = savedTheme === "dark" || (savedTheme !== "light" && prefersDark);
              document.documentElement.classList.toggle("dark", isDark);
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
