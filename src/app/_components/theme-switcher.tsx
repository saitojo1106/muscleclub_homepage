"use client";

import { useEffect, useState, memo } from "react";
import styles from "@/app/_components/theme-switcher.module.css";

const STORAGE_KEY = "theme";
type ColorSchemePreference = "dark" | "light" | "system";
const modes: ColorSchemePreference[] = ["system", "dark", "light"];

// サーバーサイドでの初期レンダリングでFOUCを防ぐためのスクリプト
const NoFOUCScript = (storageKey: string) => {
  const key = storageKey;
  const initialValue = document.documentElement.style.colorScheme === "dark" ? "dark" : "light";
  
  // この関数はDOMを更新します
  window.updateDOM = () => {
    // ユーザーの好みのカラースキームを取得
    const preference = localStorage.getItem(key) || initialValue;
    
    // システムの場合は、マッチメディアクエリをチェック
    const isDark = 
      preference === "dark" || 
      (preference === "system" && 
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    // DOMを更新
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    
    // data-mode属性を設定
    document.documentElement.setAttribute("data-mode", preference);
  };
  
  // 初期実行
  window.updateDOM();
  
  // システム設定の変更をリッスン
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", window.updateDOM);
  
  return window.updateDOM;
};

// スクリプトのみで使用するためのグローバル宣言
declare global {
  interface Window {
    updateDOM: () => void;
  }
}

export const ThemeSwitcher = () => {
  // スタティックサイト生成時にも動作させるため、サーバー側で"system"をデフォルト値として使用
  const [mode, setMode] = useState<ColorSchemePreference>("system");
  let updateDOM: () => void;

  useEffect(() => {
    // ブラウザ環境でのみローカルストレージを使用
    setMode((localStorage.getItem(STORAGE_KEY) as ColorSchemePreference) || "system");
    
    // グローバル関数をローカル変数に保存
    updateDOM = window.updateDOM;
    
    // タブ間で同期をとる
    addEventListener("storage", (e: StorageEvent): void => {
      e.key === STORAGE_KEY && setMode(e.newValue as ColorSchemePreference);
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, mode);
      updateDOM && updateDOM();
    }
  }, [mode]);

  // モード切り替え処理
  const handleModeSwitch = () => {
    const index = modes.indexOf(mode);
    setMode(modes[(index + 1) % modes.length]);
  };

  return (
    <button
      suppressHydrationWarning
      className={styles.switch}
      onClick={handleModeSwitch}
      aria-label="テーマを切り替える"
    />
  );
};

// インラインスクリプトを記述するコンポーネント
export const ThemeScript = memo(() => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(${NoFOUCScript.toString()})('${STORAGE_KEY}')`,
    }}
  />
));

// メインコンポーネント
export const ThemeSwitcherWithScript = () => (
  <>
    <ThemeScript />
    <ThemeSwitcher />
  </>
);

export default ThemeSwitcherWithScript;
