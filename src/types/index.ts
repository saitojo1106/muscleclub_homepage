// src/types/index.ts
export type Member = {
  id: number;
  name: string;
  position: string; // positionで統一（実際のデータに合わせる）
  year?: string;
  speciality?: string;
  message?: string;
  records?: string;
  instagram?: string;
  image?: string; // image_urlではなく実装に合わせてimageで統一
  order_index?: number;
  created_at?: string;
  updated_at?: string;
};

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  requirements?: string;
  fee?: string;
  image_url?: string; // 既存の実装に合わせる
  created_at?: string;
  updated_at?: string;
};

export type Competition = {
  id: number;
  title: string;
  date: string;
  location: string;
  description?: string;
  image: string; // 既存の実装に合わせる
  results: CompetitionResult[];
};

export type CompetitionResult = {
  member: string;
  category: string;
  rank: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author: {
    name: string;
    picture: string;
  };
  excerpt: string;
  content: string;
  preview?: boolean;
};

export type Entity = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // 必要なプロパティを追加
};