import { Book } from './book.model';

export interface CartItem {
  bookId: string;
  quantity: number;
  priceAtAddTime: number;
  book?: Book;
}

export interface Cart {
  _id?: string;
  userId: string | null;
  sessionId: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}