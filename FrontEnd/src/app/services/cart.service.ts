import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of,  map,tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:3000/api/cart'
  private cartSubject = new BehaviorSubject<Cart>(this.initializeCart());
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient){}
  

  private initializeCart(): Cart {
    return {
      userId: null,
      sessionId: '',
      items: [],
      totalAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  loadCart(): Observable<Cart> {

    return this.http.get<any>(
      this.API_URL
    ).pipe(

      map(response => {
        return this.normalizeCart(response.cartItems);
      }),
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );

  }
  addToCart(
    bookId: String,
    quantity: number = 1
  ): Observable<Cart> {

    return this.http.post<any>(
      `${this.API_URL}/add`,
      {
        bookId,
        quantity
      }
    ).pipe(

      map(response =>
        this.normalizeCart(response.cart)
      ),

      tap(cart => {
        this.cartSubject.next(cart);
      })

    );

  }

   updateQuantity(
    bookId: string,
    quantity: number
  ): Observable<Cart> {

    if (quantity <= 0) {
      return this.removeFromCart(bookId);
    }

    return this.http.patch<any>(
      `${this.API_URL}/update`,
      {
        bookId,
        quantity
      }
    ).pipe(

      map(response =>
        this.normalizeCart(response.cart)
      ),

      tap(cart => {
        this.cartSubject.next(cart);
      })

    );

  }


  removeFromCart(
    bookId: string
  ): Observable<Cart> {

    return this.http.delete<any>(
      `${this.API_URL}/remove`,
      {
        body: {
          bookId
        }
      }
    ).pipe(

      map(response =>
        this.normalizeCart(response.cart)
      ),

      tap(cart => {
        this.cartSubject.next(cart);
      })

    );

  }
  clearCart(): Observable<Cart> {
  return this.http.delete<any>(
    `${this.API_URL}/clear`
  ).pipe(
    map(response => this.normalizeCart(response.cart)),
    tap(cart => {
      this.cartSubject.next(cart);
    })
  );
}

  private updateCartTotal(cart: Cart): void {
    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAddTime * item.quantity);
    }, 0);
    cart.updatedAt = new Date();
  }

   getCartItemCount(): number {

    return this.cartSubject.value.items
      .reduce(
        (count, item) =>
          count + item.quantity,
        0
      );

  }


  getCartTotal(): number {
    return this.cartSubject.value.totalAmount;
  }

private normalizeCart(cart: any): Cart {

    if (!cart) {
      return this.initializeCart();
    }

    return {
      ...cart,
     items: (cart.items || []).map((item: any) => {

      // Backend populates items.bookId with the complete Book object
      const populatedBook =
        item.bookId && typeof item.bookId === 'object'
          ? item.bookId
          : item.book;

      // Keep bookId as a string for update/remove requests
      const bookId =
        typeof item.bookId === 'object'
          ? item.bookId._id
          : item.bookId;

      return {
        ...item,
        bookId,
        book: populatedBook
      };

    }),
      totalAmount: cart.totalAmount || 0
    };

  }
}