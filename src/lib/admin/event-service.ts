import { Event } from '@/lib/events';
// 全てのイベントを取得
export async function getAllEvents(): Promise<Event[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const storedData = localStorage.getItem('muscle_club_events');
    if (!storedData) {
      return [];
    }
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('イベントデータの解析中にエラーが発生しました:', error);
    return [];
  }
}

// 新しいイベントを追加
export async function addEvent(event: Omit<Event, 'id'>): Promise<Event> {
  const events = await getAllEvents();
  
  // 新しいIDを生成
  const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
  const newEvent = { ...event, id: maxId + 1 };
  
  const updatedEvents = [...events, newEvent];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(updatedEvents));
  }
  
  return newEvent;
}

// イベントを更新
export async function updateEvent(updatedEvent: Event): Promise<Event> {
  const events = await getAllEvents();
  
  const updatedEvents = events.map(event => 
    event.id === updatedEvent.id ? updatedEvent : event
  );
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(updatedEvents));
  }
  
  return updatedEvent;
}

// イベントを削除
export async function deleteEvent(id: number): Promise<void> {
  const events = await getAllEvents();
  
  const filteredEvents = events.filter(event => event.id !== id);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(filteredEvents));
  }
}

// サンプルデータロード
export async function loadSampleData(): Promise<Event[]> {
  const defaultEvents = [
    {
      id: 1,
      title: "マッスルゲート仙台2024",
      date: "2024-08-15",
      location: "仙台電力ホール",
      description: "全国から集まった学生ボディビルダーたちとの熱い戦い",
      requirements: "参加には事前登録が必要です。",
      fee: "観覧料: 2,000円、参加費: 5,000円",
    },
    {
      id: 2,
      title: "初心者向けトレーニング講座",
      date: "2024-09-10",
      location: "オンライン",
      description: "筋トレ初心者向けの基礎講座",
      requirements: "どなたでも参加いただけます",
      fee: "参加費: 1,000円",
    }
  ];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('muscle_club_events', JSON.stringify(defaultEvents));
  }
  
  return defaultEvents;
}