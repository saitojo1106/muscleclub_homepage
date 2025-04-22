// イベントの型定義
export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  requirements?: string;
  fee?: string;
};

// デフォルトのイベントデータ
const defaultEvents: Event[] = [
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

// すべてのイベントを取得
export function getAllEvents(): Event[] {
  if (typeof window === 'undefined') {
    // サーバーサイドではデフォルトデータを返す
    return defaultEvents;
  }
  
  try {
    const storedData = localStorage.getItem('muscle_club_events');
    if (!storedData) {
      // 初回のみ、デフォルトのイベントをセット
      localStorage.setItem('muscle_club_events', JSON.stringify(defaultEvents));
      return defaultEvents;
    }
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('イベントデータの解析中にエラーが発生しました:', error);
    return defaultEvents;
  }
}

// 将来のイベントのみを取得
export function getFutureEvents(): Event[] {
  const allEvents = getAllEvents();
  const now = new Date();
  
  return allEvents
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// 特定のIDのイベントを取得
export function getEventById(id: number): Event | undefined {
  const allEvents = getAllEvents();
  return allEvents.find(event => event.id === id);
}

// イベントを保存（プライベート関数）
function saveEvents(events: Event[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(events));
  }
}

// 新しいイベントを追加
export function addEvent(event: Omit<Event, 'id'>): Event {
  const events = getAllEvents();
  const maxId = events.reduce((max, evt) => Math.max(max, evt.id), 0);
  
  const newEvent: Event = {
    ...event,
    id: maxId + 1
  };
  
  const updatedEvents = [...events, newEvent];
  saveEvents(updatedEvents);
  
  return newEvent;
}

// イベントを更新
export function updateEvent(event: Event): Event {
  const events = getAllEvents();
  const updatedEvents = events.map(evt => 
    evt.id === event.id ? event : evt
  );
  
  saveEvents(updatedEvents);
  return event;
}

// イベントを削除
export function deleteEvent(id: number): void {
  const events = getAllEvents();
  const filteredEvents = events.filter(event => event.id !== id);
  saveEvents(filteredEvents);
}