import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Wishlist,WishlistItem } from '../models/wishlist.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private readonly API_URL =
    `${environment.apiUrl}/wishlist`;

  private wishlistSubject =
    new BehaviorSubject<Wishlist>(
      this.emptyWishlist()
    );

  public wishlist$ =
    this.wishlistSubject.asObservable();


  constructor( private http: HttpClient) {}


  private emptyWishlist(): Wishlist {

    return {
      userId: null,
      sessionId: '',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

  }


  loadWishlist(): Observable<Wishlist> {

    return this.http.get<any>(
      this.API_URL
    ).pipe(

      map(response => {
          return this.normalizeWishlist(response.wishlist);
      }),
      tap(wishlist => {
        this.wishlistSubject.next(wishlist);
      }),
      catchError(error => {
          console.error(
            'Failed to load wishlist:',
            error
          );

          return throwError(() => error);
        })
    );
  }



  addToWishlist(bookId: string): Observable<Wishlist> {
  return this.http
    .post<any>(
      `${this.API_URL}/add`,
      { bookId }
    )
    .pipe(
      switchMap(() => this.loadWishlist()),

      catchError(error => {
        console.error(
          'Failed to add book to wishlist:',
          error
        );

        return throwError(() => error);
      })
    );
}


  removeFromWishlist(
    bookId: string
  ): Observable<Wishlist> {

    return this.http.delete<any>(
      `${this.API_URL}/remove`,
      {
        body: { bookId }
      }
    ).pipe(

      map(response =>
        this.normalizeWishlist(response?.wishlist)),

      tap(wishlist => {
        this.wishlistSubject.next( wishlist );     
      }),
      catchError(error => {
        console.error(
          'Failed to remove book from wishlist:',
          error
        );

        return throwError(() => error);
      })
    );
  }

  isInWishlist(
    bookId: string
  ): boolean {

    return this.wishlistSubject.value.items.some(item => {

      const existingBookId =
        item.bookId &&
        typeof item.bookId === 'object'
          ? (item.bookId as any)._id
          : item.bookId;

      return existingBookId?.toString() === bookId.toString();
    });
  }


  getWishlistCount(): number {

    return this.wishlistSubject.value.items.length;

  }

  clearWishlist(): Observable<Wishlist> {

    return this.http.delete<any>(
      `${this.API_URL}/clear`
    ).pipe(

      map(response =>
        this.normalizeWishlist(response?.wishlist)),

      tap(wishlist => {
        this.wishlistSubject.next(wishlist);     
      }),
      catchError(error => {
        console.error(
          'Failed to clear wishlist:',
          error
        );

        return throwError(() => error);
      })
    );

  }
  private normalizeWishlist(wishlist: any): Wishlist {

  if (!wishlist) {
    return this.emptyWishlist();
  }

  return {
    ...wishlist,
    items: (wishlist.items || []).map((item: any) => {

      const populatedBook =
        item.bookId && typeof item.bookId === 'object'
          ? item.bookId
          : item.book;

      const bookId =
        item.bookId && typeof item.bookId === 'object'
          ? item.bookId._id
          : item.bookId;

      return {
        ...item,
        bookId: bookId,
        book: populatedBook
      };
    })
  };
}
}