import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import EventCalendar from '@/app/_components/calendar';
import { competitions } from '@/lib/competitions'; // すでに作成済みの大会データを使用

export const metadata = {
  title: 'イベントカレンダー | マッスルクラブ',
  description: 'マッスルクラブの大会・イベント情報カレンダー',
};

export default function EventsPage() {
  // 大会データをイベント形式に変換
  const events = competitions.map(comp => ({
    id: comp.id,
    title: comp.title,
    date: comp.date,
    location: comp.location,
  }));
  
  // 今後のイベントを追加（例）
  const futureEvents = [
    {
      id: 100,
      title: 'マッスルクラブ夏合宿',
      date: '2024-08-20', // YYYY-MM-DD形式
      location: '青葉区体育館',
    },
    {
      id: 101,
      title: '初心者向けトレーニング講座',
      date: '2024-09-10',
      location: 'オンライン',
    },
    {
      id: 102,
      title: '第2回筋トレコンテスト',
      date: '2024-10-15',
      location: '仙台サンプラザホール',
    },
  ];
  
  // 全てのイベントを結合
  const allEvents = [...events, ...futureEvents];
  
  return (
    <main>
      <Container>
        <Header />
        <h1 className="text-4xl font-bold mb-8 text-center">イベントカレンダー</h1>
        
        <EventCalendar events={allEvents} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">今後のイベント</h2>
          <div className="space-y-6">
            {futureEvents.map(event => (
              <div key={event.id} className="border p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  <span className="font-medium">日時:</span> {new Date(event.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">場所:</span> {event.location}
                </p>
                <div className="mt-4 flex">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-4">
                    参加登録
                  </button>
                  <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                    詳細情報
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}