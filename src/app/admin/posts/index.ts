// src/types/index.ts
export type Member = {
  id: number;
  name: string;
  position: string;
  year: string;
  description: string;
  image?: string;
  speciality?: string;
  message?: string;
  records?: string;
  instagram?: string;
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
};

// 他の共通型定義...