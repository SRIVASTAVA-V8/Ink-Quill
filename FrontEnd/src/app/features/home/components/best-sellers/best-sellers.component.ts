import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../services/book.service';
import { CartService } from '../../../../services/cart.service';
import { WishlistService } from '../../../../services/wishlist.service';
import { Book } from '../../../../models/book.model';


@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent implements OnInit {
  bestsellers: Book[] = [];

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.bookService.getBestsellers().subscribe(books => {
      this.bestsellers = books;
    });
  }

  getDiscountedPrice(book: Book): number {
    return book.discount > 0 ? book.price - (book.price * book.discount / 100) : book.price;
  }

  addToCart(bookId: string) {
    this.cartService.addToCart(bookId, 1).subscribe();
  }
}
