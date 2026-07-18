import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {Book} from '../models/book.model';
import { BookService } from './book.service';
import { Wishlist,WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Wishlist>(this.initializeWishlist());
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(private bookService: BookService) {
    this.loadWishlistFromStorage();
  }

  private initializeWishlist(): Wishlist {
    return {
      userId: null,
      sessionId: 'session_' + Date.now(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private loadWishlistFromStorage(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      const wishlist: Wishlist = JSON.parse(storedWishlist);
      wishlist.items.forEach(item => {
        this.bookService.getBook(item.bookId).subscribe(book => {
          if (book) {
            item.book = book;
          }
        });
      });
      this.wishlistSubject.next(wishlist);
    }
  }

  private saveWishlistToStorage(wishlist: Wishlist): void {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    this.wishlistSubject.next(wishlist);
  }

  addToWishlist(bookId: string): Observable<Wishlist> {
    const currentWishlist = this.wishlistSubject.value;
    
    if (!this.isInWishlist(bookId)) {
      this.bookService.getBook(bookId).subscribe(book => {
        if (book) {
          currentWishlist.items.push({
            bookId: bookId,
            addedAt: new Date(),
            book: book
          });
          currentWishlist.updatedAt = new Date();
          this.saveWishlistToStorage(currentWishlist);
        }
      });
    }
    
    return of(currentWishlist);
  }

  removeFromWishlist(bookId: string): Observable<Wishlist> {
    const currentWishlist = this.wishlistSubject.value;
    currentWishlist.items = currentWishlist.items.filter(item => item.bookId !== bookId);
    currentWishlist.updatedAt = new Date();
    this.saveWishlistToStorage(currentWishlist);
    return of(currentWishlist);
  }

  isInWishlist(bookId: string): boolean {
    return this.wishlistSubject.value.items.some(item => item.bookId === bookId);
  }

  getWishlistCount(): number {
    return this.wishlistSubject.value.items.length;
  }

  clearWishlist(): Observable<Wishlist> {
    const currentWishlist = this.wishlistSubject.value;
    currentWishlist.items = [];
    currentWishlist.updatedAt = new Date();
    this.saveWishlistToStorage(currentWishlist);
    return of(currentWishlist);
  }
}