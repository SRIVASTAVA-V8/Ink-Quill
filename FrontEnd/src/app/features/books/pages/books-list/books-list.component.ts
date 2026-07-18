import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css']
})
export class BooksListComponent  implements OnInit {
allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  displayedBooks: Book[] = [];
  loading = true;
  searchTerm = '';
  currentFilters: any = {};
  currentSort = '';

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.currentFilters.category = params['category'];
      }
    });
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(books => {
      this.allBooks = books;
      this.applyFilters(this.currentFilters);
      this.loading = false;
    });
  }

  applyFilters(filters: any) {
    this.currentFilters = filters;
    this.filteredBooks = this.allBooks.filter(book => {
      let match = true;
      
      if (filters.category && filters.category !== 'All') {
        match = match && book.category === filters.category;
      }
      if (filters.minPrice) {
        match = match && book.price >= filters.minPrice;
      }
      if (filters.maxPrice) {
        match = match && book.price <= filters.maxPrice;
      }
      if (filters.rating) {
        match = match && book.ratingAvg >= filters.rating;
      }
      if (this.searchTerm) {
        match = match && (book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }
      
      return match;
    });
    
    this.applySort(this.currentSort);
  }

  applySort(sort: string) {
    this.currentSort = sort;
    const sorted = [...this.filteredBooks];
    
    switch(sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    this.displayedBooks = sorted;
  }

  searchBooks() {
    this.applyFilters(this.currentFilters);
  }
  handleBookAction(event: { action: string; bookId: string }) {
    if (event.action === 'add-to-cart') {
      // Optional: Show success message
      console.log('Book added to cart:', event.bookId);
    }
  }

  addToCart(bookId: string) {
    this.cartService.addToCart(bookId, 1).subscribe();
  }

  getDiscountedPrice(book: Book): number {
    return book.discount > 0 ? book.price - (book.price * book.discount / 100) : book.price;
  }
}
