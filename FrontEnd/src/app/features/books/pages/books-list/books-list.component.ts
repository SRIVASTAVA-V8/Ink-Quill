import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent implements OnInit, OnDestroy {
  // Final books shown in the UI
  displayedBooks: Book[] = [];

  loading = true;
  error = false;

  // Search coming from SearchComponent
  searchTerm = '';

  // Current filter state
  currentFilters: any = {
  category: null,
  minPrice: null,
  maxPrice: null,
  rating: null
};
  // Current sorting option
  currentSort = '';

  private searchSubscription?: Subscription;
  private routeSubscription?: Subscription;


  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {}


  ngOnInit(): void {

    // --------------------------------
    // CATEGORY FROM URL
    // --------------------------------

    this.route.queryParams.subscribe(params => {

      if (params['category']) {

        this.currentFilters = {
          ...this.currentFilters,
          category: params['category'] || null
        };

      }

      this.loadBooks();

    });


    // --------------------------------
    // SEARCH FROM NAVBAR
    // --------------------------------

    this.searchSubscription =
      this.searchService.search$.subscribe(term => {

        this.searchTerm = term.trim();

        this.loadBooks();

      });

  }


  // ==================================
  // LOAD BOOKS
  // ==================================

  private loadBooks(): void {

    this.loading = true;
    this.error = false;


    this.bookService
      .getBooks({

        collection: 'all',

        category:
          this.currentFilters.category,

        search:
          this.searchTerm || undefined,

        min_price:
          this.currentFilters.minPrice,

        max_price:
          this.currentFilters.maxPrice,

        sortby:
          this.mapSortValue(this.currentSort),

        page: 1,

        limit: 12

      })
      .subscribe({

        next: (response) => {

          this.displayedBooks =
            response.books;

          this.loading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load books:',
            error
          );

          this.displayedBooks = [];

          this.error = true;

          this.loading = false;

        }

      });

  }


  // ==================================
  // FILTER CHANGE
  // ==================================

  applyFilters(filters: any): void {

    this.currentFilters = { ...this.currentFilters, ...filters };

    this.loadBooks();

  }


  // ==================================
  // SORT CHANGE
  // ==================================

  applySort(sort: string): void {

    this.currentSort = sort;

    this.loadBooks();

  }

  private mapSortValue(
    sort: string
  ): string | undefined {

    switch (sort) {

      case 'price-asc':
        return 'price_asc';

      case 'price-desc':
        return 'price_desc';

      case 'rating':
        return 'bestseller';

      case 'newest':
        return 'newest';

      default:
        return undefined;

    }

  }

  

  // ==================================
  // BOOK ACTION
  // ==================================

  handleBookAction(
    event: {
      action: string;
      bookId: string;
    }
  ): void {

    if (event.action === 'add-to-cart') {

      console.log(
        'Book added to cart:',
        event.bookId
      );

    }

  }


  // ==================================
  // DISCOUNTED PRICE
  // ==================================

  getDiscountedPrice(book: Book): number {

    return book.discount > 0

      ? book.price -
        (book.price * book.discount / 100)

      : book.price;

  }


  // ==================================
  // CLEANUP
  // ==================================

  ngOnDestroy(): void {

    this.searchSubscription?.unsubscribe();

  }

}