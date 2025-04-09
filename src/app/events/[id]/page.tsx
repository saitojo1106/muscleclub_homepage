import { notFound } from 'next/navigation';
import Container from '@/app/_components/container';
import Header from '@/app/_components/header';
import Link from 'next/link';

// 大会・イベントデータ (実際の実装では別ファイルに移動するとよいでしょう)
const events = [
  {
    id: 1,
    title: "マッスルゲート仙台2024",
    date: "2024-08-15",
    location: "仙台電力ホール",
    description: "全国から集まった学生ボディビルダーたちとの熱い戦いです。マッスルクラブからも複数名が出場予定です。",
    requirements: "参加には事前登録が必要です。",
    fee: "観覧料: 2,000円、参加費: 5,000円",
  },
  {
    id: 2,
    title: "マッスルゲート仙台",
    date: "2023-08-15",
    location: "仙台電力ホール",
    description: "学生ボディビルコンテストです。昨年度は大変盛り上がりました。",
    requirements: "過去の大会記録です。",
    fee: "観覧料: 1,800円、参加費: 4,800円",
  },
  {
    id: 3,
    title: "宮城選手権ボディビル大会",
    date: "2024-08-02",
    location: "仙台市体育館",
    description: "宮城県内の競技者が集まる大会です。各カテゴリーでの熱い戦いが予想されます。",
    requirements: "参加にはJBBFの会員登録が必要です。",
    fee: "観覧料: 2,500円、参加費: 8,000円",
  },
  {
    id: 100,
    title: 'マッスルクラブ夏合宿',
    date: '2024-08-20',
    location: '青葉区体育館',
    description: "3日間の集中トレーニング合宿です。食事管理も含めた総合プログラムを実施します。",
    requirements: "部員限定イベントです。",
    fee: "参加費: 12,000円（食事代込み）",
  },
  {
    id: 101,
    title: '初心者向けトレーニング講座',
    date: '2024-09-10',
    location: 'オンライン',
    description: "筋トレ初心者向けの基礎講座です。正しいフォームと効果的なトレーニング方法を学べます。",
    requirements: "特に条件はありません。どなたでも参加いただけます。",
    fee: "参加費: 1,000円",
  },
  {
    id: 102,
    title: '第2回筋トレコンテスト',
    date: '2024-10-15',
    location: '仙台サンプラザホール',
    description: "マッスルクラブ主催の筋トレコンテストです。種目ごとの記録を競います。",
    requirements: "会員登録が必要です。",
    fee: "参加費: 3,000円",
  },
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return notFound();
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
  const event = events.find(e => e.id === eventId);
  
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
  return events.map((event) => ({
    id: event.id.toString(),
  }));
}