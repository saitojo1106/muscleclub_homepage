export type Event = {
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    requirements: string;
    fee: string;
    isPast?: boolean; // 過去のイベントかどうか
  };
  
  export const events: Event[] = [
    // 既存のイベントデータ
  ];
  
  // ユーティリティ関数
  export function getFutureEvents() {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  export function getPastEvents() {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) <= today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 降順
  }
  
  export function getEventById(id: number) {
    return events.find(event => event.id === id);
  }