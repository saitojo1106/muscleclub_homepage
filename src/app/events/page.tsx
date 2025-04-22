import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import EventCalendar from '@/app/_components/calendar';
import { getAllEvents, getFutureEvents } from '@/lib/events';

export const metadata = {
  title: 'イベントカレンダー | マッスルクラブ',
  description: 'マッスルクラブの大会・イベント情報カレンダー',
};

// Next.js 13以降のサーバーコンポーネント
export default async function EventsPage() {
  // サーバーサイドでイベントデータを取得
  const events = await getAllEvents();
  const futureEvents = getFutureEvents();

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

        <div>
          <h1>イベント一覧</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h2>{event.title}</h2>
                <p>日付: {new Date(event.date).toLocaleDateString('ja-JP')}</p>
                <p>場所: {event.location}</p>
                {event.description && <p>{event.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}