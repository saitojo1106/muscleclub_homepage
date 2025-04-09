"use client";

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import 'react-calendar/dist/Calendar.css';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  // その他のイベント情報
};

type CalendarProps = {
  events: Event[];
};

export default function EventCalendar({ events }: CalendarProps) {
  const [date, setDate] = useState(new Date());

  // 日付からイベントを検索する関数
  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // カレンダーのタイル内容をカスタマイズ
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // 月表示の場合のみイベントを表示
    if (view === 'month') {
      const eventsForDate = getEventsForDate(date);
      
      return eventsForDate.length > 0 ? (
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1.5 rounded-full"></div>
        </div>
      ) : null;
    }
    return null;
  };

  // 日付がクリックされたときの処理
  const handleDateClick = (value: Date) => {
    setDate(value);
  };

  // 選択された日付のイベント
  const selectedDateEvents = getEventsForDate(date);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
          <Calendar
            onChange={handleDateClick}
            value={date}
            tileContent={tileContent}
            locale="ja-JP"
            className="w-full border-0 rounded-lg"
          />
        </div>
      </div>
      
      <div className="md:w-1/2">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">
            {format(date, 'yyyy年MM月dd日 (EEEE)', { locale: ja })} のイベント
          </h3>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-lg">{event.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">場所: {event.location}</p>
                  <Link 
                    href={`/achievements#competition-${event.id}`}
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