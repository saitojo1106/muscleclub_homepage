import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import EventCalendar from '@/app/_components/calendar';

export const metadata = {
  title: 'イベントカレンダー | マッスルクラブ',
  description: 'マッスルクラブの大会・イベント情報カレンダー',
};

// 大会・イベントデータ
const events = [
  {
    id: 1,
    title: "マッスルゲート仙台2024",
    date: "2024-08-15",
    location: "仙台電力ホール",
  },
  {
    id: 2,
    title: "マッスルゲート仙台",
    date: "2023-08-15",
    location: "仙台電力ホール",
  },
  {
    id: 3,
    title: "宮城選手権ボディビル大会",
    date: "2024-08-02",
    location: "仙台市体育館",
  },
  {
    id: 100,
    title: 'マッスルクラブ夏合宿',
    date: '2024-08-20',
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

export default function EventsPage() {
  // 現在の日付より後のイベントのみをフィルタリング
  const futureEvents = events.filter(event => new Date(event.date) > new Date());
  // 日付順に並べ替え
  futureEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <main>
      <Container>
        <Header />
        <h1 className="text-4xl font-bold mb-8 text-center">イベントカレンダー</h1>
        
        <EventCalendar events={events} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">今後のイベント</h2>
          {futureEvents.length > 0 ? (
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                      参加登録
                    </button>
                    <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                      詳細情報
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              現在予定されている今後のイベントはありません
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}