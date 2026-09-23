import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,forkJoin} from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
  Book,
  RelatedBooks
} from '../models/book.model';


export interface BookQueryParams {

  collection?: string;

  category?: string;

  search?: string;

  language?: string;

  author?: string;

  min_price?: number;

  max_price?: number;

  sortby?: string;

  exclude?: string;

  page?: number;

  limit?: number;

}


export interface BooksResponse {

  warningMessage?: string | null;

  books: Book[];
  pagination: {
    currentPage: number;
    limit: number;
    totalBooks: number;
    totalPages: number;
  };

}


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly API_URL =
    `${environment.apiUrl}/collection`;


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET BOOKS
  // ==========================================

  getBooks(
    options: BookQueryParams = {}
  ): Observable<BooksResponse> {

    const collection =
      options.collection || 'all';

    let params = new HttpParams();


    if (options.category) {

      params = params.set(
        'category',
        options.category
      );

    }


    if (options.search) {

      params = params.set(
        'search',
        options.search
      );

    }


    if (options.language) {

      params = params.set(
        'language',
        options.language
      );

    }


    if (options.author) {

      params = params.set(
        'author',
        options.author
      );

    }


    if (
      options.min_price !== null &&
      options.min_price !== undefined
    ) {

      params = params.set(
        'min_price',
        options.min_price.toString()
      );

    }


    if (
      options.max_price !== null &&
      options.max_price !== undefined
    ) {

      params = params.set(
        'max_price',
        options.max_price.toString()
      );

    }


    if (options.sortby) {

      params = params.set(
        'sortby',
        options.sortby
      );

    }


    if (options.exclude) {

      params = params.set(
        'exclude',
        options.exclude
      );

    }


    if (options.page) {

      params = params.set(
        'page',
        options.page.toString()
      );

    }


    if (options.limit) {

      params = params.set(
        'limit',
        options.limit.toString()
      );

    }


    return this.http.get<BooksResponse>(
      `${this.API_URL}/${collection}`,
      {
        params
      }
    );

  }


  // ==========================================
  // GET SINGLE BOOK
  // ==========================================

  getBook(id: string): Observable<Book> {

  return this.http.get<Book>(
    `${this.API_URL}/item/${id}`)
  

}


  // ==========================================
  // RELATED BOOKS
  // ==========================================

  getRelatedBooks(
    book: Book
  ): Observable<RelatedBooks> {

    return forkJoin({

      // --------------------------------------
      // More by same author
      // --------------------------------------

      bySameAuthor:
        this.getBooksByAuthor(
          book.author,
          book._id,
          4
        ),


      // --------------------------------------
      // More in same category
      // --------------------------------------

      bySameCategory:
        this.getBooksByCategory(
          book.category,
          book._id,
          4
        ),


      // --------------------------------------
      // Bestseller candidates by author
      // --------------------------------------

      bestsellersByAuthor:
        this.getBestsellersByAuthor(
          book.author,
          book._id,
          4
        ),


      // --------------------------------------
      // Bestseller candidates by category
      // --------------------------------------

      bestsellersInCategory:
        this.getBestsellersByCategory(
          book.category,
          book._id,
          4
        )

    }).pipe(

      map(result => {

        // ------------------------------------
        // Merge bestseller candidates
        // ------------------------------------

        const bestsellerCandidates = [
          ...result.bestsellersByAuthor.books,
          ...result.bestsellersInCategory.books
        ];


        // ------------------------------------
        // Remove duplicate books
        // ------------------------------------

        const uniquePopularPicks =
          bestsellerCandidates.filter(
            (book, index, books) =>
              index ===
              books.findIndex(
                item => item._id === book._id
              )
          );


        // ------------------------------------
        // Make sure current book is excluded
        // ------------------------------------

        const popularPicks =
          uniquePopularPicks
            .filter(
              relatedBook =>
                relatedBook._id !== book._id
            )
            .slice(0, 4);


        return {

          bySameAuthor:
            result.bySameAuthor.books,

          bySameCategory:
            result.bySameCategory.books,

          popularPicks

        };

      })

    );

  }
  // ==========================================
  // SAME AUTHOR
  // ==========================================

  getBooksByAuthor(
    author: string,
    exclude?: string,
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      author,

      exclude,

      page: 1,

      limit

    });

  }


  // ==========================================
  // SAME CATEGORY
  // ==========================================

  getBooksByCategory(
    category: string,
    exclude?: string,
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      category,

      exclude,

      page: 1,

      limit

    });

  }


  // ==========================================
  // BESTSELLERS BY AUTHOR
  // ==========================================

  getBestsellersByAuthor(
    author: string,
    exclude?: string,
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      author,

      sortby: 'bestseller',

      exclude,

      page: 1,

      limit

    });

  }


  // ==========================================
  // BESTSELLERS BY CATEGORY
  // ==========================================

  getBestsellersByCategory(
    category: string,
    exclude?: string,
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      category,

      sortby: 'bestseller',

      exclude,

      page: 1,

      limit

    });

  }


  // ==========================================
  // BESTSELLERS
  // ==========================================

  getBestsellers(
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'bestsellers',

      page: 1,

      limit

    });

  }


  // ==========================================
  // NEW RELEASES
  // ==========================================

  getNewReleases(
    limit: number = 4
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'newarrivals',

      page: 1,

      limit

    });

  }


  // ==========================================
  // SEARCH
  // ==========================================

  searchBooks(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      search: query,

      page,

      limit

    });

  }


  // ==========================================
  // CATEGORY
  // ==========================================

  getBooksByCategoryOnly(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Observable<BooksResponse> {

    return this.getBooks({

      collection: 'all',

      category,

      page,

      limit

    });

  }

}