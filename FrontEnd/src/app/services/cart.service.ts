import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import{Book} from '../models/book.model';
import { Cart, CartItem } from '../models/cart.model';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.initializeCart());
  public cart$ = this.cartSubject.asObservable();

  constructor(private bookService: BookService) {
    this.loadCartFromStorage();
  }

  private initializeCart(): Cart {
    return {
      userId: null,
      sessionId: this.generateSessionId(),
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart: Cart = JSON.parse(storedCart);
      // Reload book data for each item
      cart.items.forEach(item => {
        this.bookService.getBook(item.bookId).subscribe(book => {
          if (book) {
            item.book = book;
          }
        });
      });
      this.cartSubject.next(cart);
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  addToCart(bookId: string, quantity: number = 1): Observable<Cart> {
    const currentCart = this.cartSubject.value;
    
    this.bookService.getBook(bookId).subscribe(book => {
      if (!book) return;

      const existingItem = currentCart.items.find(item => item.bookId === bookId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.priceAtAddTime = book.price;
      } else {
        currentCart.items.push({
          bookId: bookId,
          quantity: quantity,
          priceAtAddTime: book.price,
          book: book
        });
      }
      
      this.updateCartTotal(currentCart);
      this.saveCartToStorage(currentCart);
    });
    
    return of(currentCart).pipe();
  }

  updateQuantity(bookId: string, quantity: number): Observable<Cart> {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.bookId === bookId);
    
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.updateCartTotal(currentCart);
      this.saveCartToStorage(currentCart);
    } else if (quantity === 0) {
      this.removeFromCart(bookId);
    }
    
    return of(currentCart);
  }

  removeFromCart(bookId: string): Observable<Cart> {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.bookId !== bookId);
    this.updateCartTotal(currentCart);
    this.saveCartToStorage(currentCart);
    return of(currentCart);
  }

  clearCart(): Observable<Cart> {
    const currentCart = this.cartSubject.value;
    currentCart.items = [];
    currentCart.totalAmount = 0;
    this.saveCartToStorage(currentCart);
    return of(currentCart);
  }

  private updateCartTotal(cart: Cart): void {
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAddTime * item.quantity);
    }, 0);
    cart.updatedAt = new Date();
  }

  getCartItemCount(): number {
    return this.cartSubject.value.items.reduce((count, item) => count + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartSubject.value.totalAmount;
  }
}