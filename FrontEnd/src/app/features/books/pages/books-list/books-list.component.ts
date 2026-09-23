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
  totalPages = 0;
  currentPage = 1;
  pageSize = 12;
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
        this.currentPage=1;

      }

      this.loadBooks();
    });


    // --------------------------------
    // SEARCH FROM NAVBAR
    // --------------------------------

    this.searchSubscription =
      this.searchService.search$.subscribe(term => {

        this.searchTerm = term.trim();
        this.currentPage=1;

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

        page: this.currentPage,

        limit: this.pageSize

      })
      .subscribe({

        next: (response) => {

          this.displayedBooks =
            response.books;

          this.totalPages =
           response.pagination.totalPages;

          this.currentPage =
           response.pagination.currentPage;

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
    this.currentPage=1;

    this.loadBooks();

  }


  // ==================================
  // SORT CHANGE
  // ==================================

  applySort(sort: string): void {

    this.currentSort = sort;
    this.currentPage=1;

    this.loadBooks();

  }

  goToPage(page: number): void {

  if (
    page < 1 ||
    page > this.totalPages ||
    page === this.currentPage
  ) {
    return;
  }

  this.currentPage = page;

  this.loadBooks();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}

goToPreviousPage(): void {

  if (this.currentPage > 1) {

    this.currentPage--;

    this.loadBooks();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}

goToNextPage(): void {

  if (this.currentPage < this.totalPages) {

    this.currentPage++;

    this.loadBooks();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}

getPages(): number[] {

  return Array.from(
    { length: this.totalPages },
    (_, index) => index + 1
  );

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