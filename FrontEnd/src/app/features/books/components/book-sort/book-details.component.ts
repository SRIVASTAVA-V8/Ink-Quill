import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/models/book.model';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    const bookId = this.route.snapshot.params['id'];
    this.bookService.getBook(bookId).subscribe(book => {
      this.book = book || null;
      this.checkWishlistStatus();
    });
  }

  checkWishlistStatus() {
    if (this.book) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.book._id);
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
  }

  getDiscountedPrice(): number {
    if (!this.book) return 0;
    return this.book.discount > 0 ? 
      this.book.price - (this.book.price * this.book.discount / 100) : 
      this.book.price;
  }

  goBack() {
    this.router.navigate(['/books']);
  }
}
