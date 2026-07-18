import { Book } from './book.model';  
export interface WishlistItem {
  bookId: string;
  addedAt: Date;
  book?: Book;
}

export interface Wishlist {
  _id?: string;
  userId: string | null;
  sessionId: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt?: Date;
}