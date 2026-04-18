export interface Message {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  keywords: string[];
}

export type Category = string;
export type Tag = string;
