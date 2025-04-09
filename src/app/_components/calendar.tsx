"use client";

import { useState } from 'react';
import { 
  format, 
  startOfMonth,
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
};

type CalendarProps = {
  events: Event[];
};

export default function EventCalendar({ events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 前月に移動
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // 次月に移動
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 指定日のイベントを取得
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(date, eventDate);
    });
  };

  // カレンダーの日付セルをレンダリング
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    // 曜日のヘッダー
    const weekDays = [];
    const dateFormat = 'E';
    for (let i = 0; i < 7; i++) {
      const dayOfWeek = addDays(startDate, i);
      const isWeekend = i === 0 || i === 6;
      weekDays.push(
        <div 
          key={`header-${i}`} 
          className={`text-center font-semibold py-2 ${
            isWeekend ? 'text-red-500 dark:text-red-400' : ''
          }`}
        >
          {format(dayOfWeek, dateFormat, { locale: ja })}
        </div>
      );
    }
    rows.push(
      <div key="header" className="grid grid-cols-7 gap-1 mb-2">
        {weekDays}
      </div>
    );

    // 日付セル
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const eventsForDay = getEventsForDate(cloneDay);
        const hasEvents = eventsForDay.length > 0;
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;
        
        days.push(
          <div
            key={day.toString()}
            className={`
              p-2 relative min-h-[80px] border border-gray-200 dark:border-gray-700
              ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500' : ''}
              ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 font-bold' : ''}
              ${isSelected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
              ${isWeekend && isCurrentMonth ? 'text-red-500 dark:text-red-400' : ''}
              cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/70
            `}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="text-right">
              {format(day, 'd')}
            </div>
            
            {hasEvents && (
              <div className="mt-1 space-y-1">
                {eventsForDay.map((event, index) => (
                  <div 
                    key={index} 
                    className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs p-1 rounded truncate" 
                    title={event.title}
                  >
                    {event.title.length > 15 ? `${event.title.substring(0, 15)}...` : event.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    
    return rows;
  };

  // 選択された日付のイベント
  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          {/* カレンダーのヘッダー */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <h2 className="text-xl font-bold">
              {format(currentMonth, 'yyyy年 MMMM', { locale: ja })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* カレンダー本体 */}
          <div className="mb-2">
            {renderCells()}
          </div>
        </div>
      </div>
      
      <div className="md:w-1/3">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">
            {format(selectedDate, 'yyyy年MM月dd日 (EEEE)', { locale: ja })} のイベント
          </h3>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-lg">{event.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">場所: {event.location}</p>
                  <Link 
                    href={`/events/${event.id}`}
                    className="text-blue-500 hover:underline text-sm inline-flex items-center mt-2"
                  >
                    詳細を見る
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">予定されているイベントはありません</p>
          )}
        </div>
      </div>
    </div>
  );
}