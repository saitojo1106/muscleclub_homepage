import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Event } from '@/lib/events';

const EVENTS_FILE_PATH = path.join(process.cwd(), 'data', 'events.json');

// イベント一覧を取得
export async function GET() {
  try {
    const fileExists = await fs.access(EVENTS_FILE_PATH).then(() => true).catch(() => false);
    
    if (!fileExists) {
      // ファイルが存在しない場合は空の配列を返す
      return NextResponse.json([]);
    }
    
    const data = await fs.readFile(EVENTS_FILE_PATH, 'utf8');
    const events = JSON.parse(data);
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('イベントの取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'イベントの取得に失敗しました' }, { status: 500 });
  }
}

// 新しいイベントを作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json(
        { error: 'タイトル、日付、場所は必須です' },
        { status: 400 }
      );
    }
    
    // 現在のイベントを読み込む
    let events: Event[] = [];
    try {
      const fileExists = await fs.access(EVENTS_FILE_PATH).then(() => true).catch(() => false);
      
      if (fileExists) {
        const data = await fs.readFile(EVENTS_FILE_PATH, 'utf8');
        events = JSON.parse(data);
      }
    } catch (error) {
      // ファイルが存在しない場合は空の配列を使用
    }
    
    // 新しいIDを生成
    const maxId = events.reduce((max, event) => Math.max(max, event.id), 0);
    const newEvent = { ...body, id: maxId + 1 };
    
    // 新しいイベントを追加
    events.push(newEvent);
    
    // ディレクトリが存在することを確認
    await fs.mkdir(path.dirname(EVENTS_FILE_PATH), { recursive: true });
    
    // ファイルに保存
    await fs.writeFile(EVENTS_FILE_PATH, JSON.stringify(events, null, 2));
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('イベントの作成中にエラーが発生しました:', error);
    return NextResponse.json({ error: 'イベントの作成に失敗しました' }, { status: 500 });
  }
}