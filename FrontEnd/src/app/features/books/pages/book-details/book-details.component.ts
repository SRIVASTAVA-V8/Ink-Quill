import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, RelatedBooks } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
book: Book | null = null;
  quantity = 1;
  isInWishlist = false;
  loadingBook = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
    const bookId = params.get('id');
    if (bookId) {
      this.loadBookDetails(bookId);
    }
  });
  }

  loadBookDetails(bookId: string): void {

    this.loadingBook = true;
    this.book = null;

    this.bookService.getBook(bookId).subscribe({

      next: (book) => {

        this.book = book;
        console.log(book);

        this.loadingBook = false;

        this.checkWishlistStatus();

      },

      error: (error) => {

        console.error(
          'Failed to load book:',
          error
        );

        this.loadingBook = false;

        this.router.navigate(['/books']);

      }

    });

  }



  checkWishlistStatus() {
    if (this.book) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.book._id);
    }
    else {
      return;
    }
  }

  incrementQuantity() {
    if (this.book && this.quantity < this.book.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.book) {
      this.cartService.addToCart(this.book._id, this.quantity).subscribe();
    }
    else{return;}

  }

  toggleWishlist() {
    if (this.book) {
      if (this.isInWishlist) {
        this.wishlistService.removeFromWishlist(this.book._id).subscribe(() => {
          this.isInWishlist = false;
        });
      } else {
        this.wishlistService.addToWishlist(this.book._id).subscribe(() => {
          this.isInWishlist = true;
        });
      }
    }
    else
    {
      return;
    }
  }

   getDiscountedPrice(): number {

    if (!this.book) {
      return 0;
    }

    if (this.book.discount <= 0) {
      return Math.round(this.book.price);
    }

    const discounted =
      this.book.price -
      (
        this.book.price *
        this.book.discount /
        100
      );

    return Math.round(discounted);

  }

  getBookPrice(book: Book | null | undefined): number {
    if (!book) return 0;
    const base = typeof book.price === 'number' ? book.price : 0;
    const discount = typeof book.discount === 'number' ? book.discount : 0;
    const price = discount > 0 ? base - (base * discount / 100) : base;
    return Math.round(price * 100) / 100;
  }


  goBack() {
    this.router.navigate(['/books']);
  }
}
