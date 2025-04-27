"use client";

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
          <div key={`empty-start-${index}`} className="h-14 p-1" />
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
              className={`h-14 p-1 border rounded cursor-pointer transition ${
                dayEvents.length > 0 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
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
          <div key={`empty-end-${index}`} className="h-14 p-1" />
        ))}
      </div>
    </div>
  );
}