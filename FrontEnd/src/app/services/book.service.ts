import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Book,RelatedBooks } from '../models/book.model';
import { DUMMY_BOOKS } from '../services/dummy-data';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [...DUMMY_BOOKS];

  getBooks(): Observable<Book[]> {
    return of(this.books).pipe(delay(500));
  }

  getBook(id: string): Observable<Book | undefined> {
    const book = this.books.find(b => b._id === id);
    return of(book).pipe(delay(300));
  }

  // Get related books based on author, category, and bestsellers
  getRelatedBooks(bookId: string): Observable<RelatedBooks> {
    return new Observable<RelatedBooks>(observer => {
      this.getBook(bookId).subscribe(currentBook => {
        if (!currentBook) {
          observer.next({
            bySameAuthor: [],
            bySameCategory: [],
            bestsellersInCategory: [],
            recommendedForYou: []
          });
          observer.complete();
          return;
        }

        // Books by same author (excluding current book)
        const bySameAuthor = this.books
          .filter(book => 
            book._id !== currentBook._id && 
            book.author === currentBook.author
          )
          .slice(0, 4);

        // Books by same category (excluding current book)
        const bySameCategory = this.books
          .filter(book => 
            book._id !== currentBook._id && 
            book.category === currentBook.category
          )
          .slice(0, 4);

        // Bestsellers in same category (by rating, excluding current book)
        const bestsellersInCategory = this.books
          .filter(book => 
            book._id !== currentBook._id && 
            book.category === currentBook.category
          )
          .sort((a, b) => b.ratingAvg - a.ratingAvg)
          .slice(0, 4);

        // Recommended for you (mix of author and category books)
        const recommendedForYou = this.getRecommendedBooks(currentBook);

        observer.next({
          bySameAuthor,
          bySameCategory,
          bestsellersInCategory,
          recommendedForYou
        });
        observer.complete();
      });
    }).pipe(delay(300));
  }

  // Get recommended books based on user's current book
  private getRecommendedBooks(currentBook: Book): Book[] {
    const recommended: Book[] = [];
    const usedBookIds = new Set<string>([currentBook._id]);

    // First try to get books by same author
    const authorBooks = this.books
      .filter(book => 
        book._id !== currentBook._id && 
        book.author === currentBook.author
      )
      .sort((a, b) => b.ratingAvg - a.ratingAvg);

    authorBooks.forEach(book => {
      if (!usedBookIds.has(book._id) && recommended.length < 4) {
        recommended.push(book);
        usedBookIds.add(book._id);
      }
    });

    // Then try to get books from same category
    const categoryBooks = this.books
      .filter(book => 
        book._id !== currentBook._id && 
        book.category === currentBook.category
      )
      .sort((a, b) => b.ratingAvg - a.ratingAvg);

    categoryBooks.forEach(book => {
      if (!usedBookIds.has(book._id) && recommended.length < 4) {
        recommended.push(book);
        usedBookIds.add(book._id);
      }
    });

    // Finally, get highest rated books from other categories
    if (recommended.length < 4) {
      const otherBooks = this.books
        .filter(book => 
          book._id !== currentBook._id && 
          !usedBookIds.has(book._id)
        )
        .sort((a, b) => b.ratingAvg - a.ratingAvg);

      otherBooks.forEach(book => {
        if (recommended.length < 4) {
          recommended.push(book);
          usedBookIds.add(book._id);
        }
      });
    }

    return recommended;
  }

  // Get bestsellers by author
  getBestsellersByAuthor(author: string): Observable<Book[]> {
    const books = this.books
      .filter(book => book.author === author)
      .sort((a, b) => b.ratingAvg - a.ratingAvg)
      .slice(0, 4);
    return of(books).pipe(delay(300));
  }

  // Get bestsellers by category
  getBestsellersByCategory(category: string): Observable<Book[]> {
    const books = this.books
      .filter(book => book.category === category)
      .sort((a, b) => b.ratingAvg - a.ratingAvg)
      .slice(0, 4);
    return of(books).pipe(delay(300));
  }

  searchBooks(query: string): Observable<Book[]> {
    const filtered = this.books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.ISBN.includes(query)
    );
    return of(filtered).pipe(delay(300));
  }

  getBooksByCategory(category: string): Observable<Book[]> {
    const filtered = this.books.filter(book => book.category === category);
    return of(filtered).pipe(delay(300));
  }

  getBestsellers(): Observable<Book[]> {
    const bestsellers = [...this.books]
      .sort((a, b) => b.ratingAvg - a.ratingAvg)
      .slice(0, 4);
    return of(bestsellers).pipe(delay(300));
  }

  getNewReleases(): Observable<Book[]> {
    const newReleases = [...this.books]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4);
    return of(newReleases).pipe(delay(300));
  }
}