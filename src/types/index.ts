// src/types/index.ts
export type Member = {
    id: number;
    name: string;
    role?: string;
    year?: string;
    speciality?: string;
    message?: string;
    records?: string;
    instagram?: string;
    image_url?: string;
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
    image_url?: string;
    created_at?: string;
    updated_at?: string;
  };
  
  export type Competition = {
    id: number;
    title: string;
    date: string;
    location: string;
    description?: string;
    image: string;
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