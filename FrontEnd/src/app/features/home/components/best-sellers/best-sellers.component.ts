import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../../services/book.service';
import { CartService } from '../../../../services/cart.service';
import { Book } from '../../../../models/book.model';


@Component({
  selector: 'app-best-sellers',
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent implements OnInit {

  bestsellers: Book[] = [];

  loading = true;

  error = false;


  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}


  ngOnInit(): void {

    this.loadBestsellers();

  }


  private loadBestsellers(): void {

    this.loading = true;
    this.error = false;


    this.bookService
      .getBestsellers(4)
      .subscribe({

        next: (response) => {
          this.bestsellers = response.books;
          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Failed to load bestselling books:',
            error
          );

          this.bestsellers = [];

          this.error = true;
          this.loading = false;

        }

      });

  }


  getDiscountedPrice(book: Book): number {

    return book.discount > 0
      ? book.price -
        (book.price * book.discount / 100)
      : book.price;

  }


  addToCart(bookId: string): void {

    this.cartService
      .addToCart(bookId, 1)
      .subscribe({

        error: (error) => {

          console.error(
            'Failed to add book to cart:',
            error
          );

        }

      });

  }

}