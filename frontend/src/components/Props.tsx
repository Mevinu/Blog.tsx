export interface Author {
  authorID: number;
  userID: number;
  userName: string;
}

export interface Blogs {
  author: Author;
  content: string;
  id: number;
  date: string;
  summary: string;
  title: string;
}
export interface Articles {
  id: number;
  title: string;
  summary: string;
  date: string;
  content: string;
  author: Author;
  imageURL: string;
}
export interface Users {
  userID: string;
  userName: string;
  su: boolean;
}
export interface Values {
  title: string;
  summary: string;
  image?: File;
  imageURL?: string;
  content?: string;
  author?: string;
}
