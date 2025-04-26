const fs = require('fs');
const path = require('path');

// 必要なディレクトリを作成する関数
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// 不足しているファイル定義
const files = [
  // 既存のファイル定義はそのまま
  {
    path: 'src/lib/auth.ts',
    content: `const STORAGE_KEY = "muscle_club_admin_token";

// ログイン処理
export async function login(username: string, password: string): Promise<boolean> {
  // 簡易認証 (本番環境では適切な認証方法に置き換える)
  if (username === "admin" && password === "muscleclub2024") {
    // トークンを作成（有効期限は24時間）
    const token = {
      user: {
        username: "admin",
        role: "admin"
      },
      expires: Date.now() + (24 * 60 * 60 * 1000) // 24時間
    };
    
    // ローカルストレージにトークンを保存
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(token));
    }
    return true;
  }
  return false;
}

// ログアウト処理
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 認証状態の確認
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const tokenStr = localStorage.getItem(STORAGE_KEY);
    if (!tokenStr) return false;
    
    const token = JSON.parse(tokenStr);
    return Date.now() < token.expires;
  } catch (error) {
    return false;
  }
}

// ユーザー情報の取得
export function getUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const tokenStr = localStorage.getItem(STORAGE_KEY);
    if (!tokenStr) return null;
    
    const token = JSON.parse(tokenStr);
    if (Date.now() > token.expires) return null;
    
    return token.user;
  } catch (error) {
    return null;
  }
}
`
  },
  {
    path: 'src/app/_components/container.tsx',
    content: `import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = '' }: Props) {
  return <div className={\`container mx-auto px-5 \${className}\`}>{children}</div>;
}
`
  },
  {
    path: 'src/lib/supabase.ts',
    content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`
  },
  // カレンダーコンポーネントを追加
  {
    path: 'src/app/_components/calendar.tsx',
    content: `"use client";

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Event } from '@/types';

type CalendarProps = {
  events: Event[];
  onDateClick?: (date: Date, events: Event[]) => void;
};

export default function Calendar({ events, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // 月の最初と最後の日を取得
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // 月の全日付を取得
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // 前月・次月に移動
  const prevMonth = () => setCurrentMonth(month => new Date(month.getFullYear(), month.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(month => new Date(month.getFullYear(), month.getMonth() + 1));
  
  // 日付をクリックした時の処理
  const handleDateClick = (day: Date) => {
    if (!onDateClick) return;
    
    // その日のイベントを抽出
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, day);
    });
    
    onDateClick(day, dayEvents);
  };

  return (
    <div className="calendar bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, 'yyyy年 M月', { locale: ja })}
        </h2>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="text-center font-medium py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {/* 月の初めの日の前の空白セル */}
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={\`empty-start-\${index}\`} className="h-14 p-1" />
        ))}
        
        {/* 月の日付 */}
        {daysInMonth.map(day => {
          // その日のイベントを検索
          const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return isSameDay(eventDate, day);
          });
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={\`h-14 p-1 border rounded cursor-pointer transition \${
                dayEvents.length > 0 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }\`}
            >
              <div className="text-right text-sm">{format(day, 'd')}</div>
              {dayEvents.length > 0 && (
                <div className="mt-1">
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <div key={event.id} className="text-xs truncate text-blue-500 dark:text-blue-400">
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      他 {dayEvents.length - 2} 件
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        
        {/* 月の終わりの日の後の空白セル */}
        {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
          <div key={\`empty-end-\${index}\`} className="h-14 p-1" />
        ))}
      </div>
    </div>
  );
}
`
  },
  // APIイベントモジュールも追加
  {
    path: 'src/lib/api/events.ts',
    content: `import { supabase } from '../supabase';
import type { Event } from '@/types';

// すべてのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) {
      console.error('イベント取得エラー:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('イベント取得中にエラーが発生しました:', error);
    return [];
  }
}

// 将来のイベントを取得
export async function getFutureEvents(): Promise<Event[]> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('将来のイベント取得エラー:', error);
    return [];
  }
}

// IDでイベントを取得
export async function getEventById(id: number): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(\`イベント取得エラー (ID: \${id}):\`, error);
    return null;
  }
}

// 新しいイベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('イベント追加エラー:', error);
    return null;
  }
}

// イベントを更新
export async function updateEvent(id: number, updates: Partial<Event>): Promise<Event | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(\`イベント更新エラー (ID: \${id}):\`, error);
    return null;
  }
}

// イベントを削除
export async function deleteEvent(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(\`イベント削除エラー (ID: \${id}):\`, error);
    return false;
  }
}
`
  }
];

// ファイルを書き込む
files.forEach(file => {
  const filePath = path.join(process.cwd(), file.path);
  ensureDirectoryExistence(filePath);
  
  // ファイルが存在しない場合のみ作成
  if (!fs.existsSync(filePath)) {
    console.log(`Creating missing file: ${file.path}`);
    fs.writeFileSync(filePath, file.content, 'utf8');
  } else {
    console.log(`File already exists: ${file.path}`);
  }
});

console.log('All missing files created!');