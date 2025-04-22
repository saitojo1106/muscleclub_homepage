import { notFound } from 'next/navigation';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import Link from 'next/link';
import { getEventById, getAllEvents } from '@/lib/events';

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  const event = getEventById(eventId);
  
  if (!event) {
    notFound();
  }
  
  return (
    <main>
      <Container>
        <Header />
        
        <div className="mb-8">
          <Link 
            href="/events" 
            className="text-blue-500 hover:underline inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            イベント一覧に戻る
          </Link>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">日時</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(event.date).toLocaleDateString('ja-JP', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">場所</h2>
                <p className="text-gray-700 dark:text-gray-300">{event.location}</p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">参加費</h2>
                <p className="text-gray-700 dark:text-gray-300">{event.fee}</p>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-lg h-full">
                <h2 className="text-xl font-semibold mb-4">参加要件</h2>
                <p className="text-gray-700 dark:text-gray-300">{event.requirements}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">イベント詳細</h2>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {event.description}
            </p>
          </div>
          
          {/* 申し込みボタンなど */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
              このイベントに申し込む
            </button>
            <button className="border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              お問い合わせ
            </button>
          </div>
        </div>
      </Container>
    </main>
  );
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  const event = getEventById(eventId);
  
  if (!event) {
    return {
      title: 'イベントが見つかりません',
    };
  }
  
  return {
    title: `${event.title} | マッスルクラブ`,
    description: event.description,
  };
}

export function generateStaticParams() {
  return getAllEvents().map((event) => ({
    id: event.id.toString(),
  }));
}