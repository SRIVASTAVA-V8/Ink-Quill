import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../services/book.service';
import { CartService } from '../../../../services/cart.service';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-featured-books',
  templateUrl: './featured-books.component.html',
  styleUrls: ['./featured-books.component.css']
})
export class FeaturedBooksComponent implements OnInit {
  featuredBooks: Book[] = [];

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.bookService.getNewReleases().subscribe(books => {
      this.featuredBooks = books;
    });
  }

  getDiscountedPrice(book: Book): number {
    return book.discount > 0 ? book.price - (book.price * book.discount / 100) : book.price;
  }

  addToCart(bookId: string) {
    this.cartService.addToCart(bookId, 1).subscribe();
  }
}