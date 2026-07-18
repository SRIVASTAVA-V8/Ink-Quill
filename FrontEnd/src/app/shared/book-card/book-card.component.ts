import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent {
  @Input() book!: Book;
  @Input() compact = false;
  @Output() bookAction = new EventEmitter<{ action: string; bookId: string }>();
  
  isInWishlist = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {
    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.isInWishlist = wishlist.items.some(item => item.bookId === this.book?._id);
    });
  }

  getDiscountedPrice(): number {
    return this.book.discount > 0 ? 
      this.book.price - (this.book.price * this.book.discount / 100) : 
      this.book.price;
  }

  addToCart(event: Event) {
    event.stopPropagation();
    if (this.book.stock > 0) {
      this.cartService.addToCart(this.book._id, 1).subscribe();
      this.bookAction.emit({ action: 'add-to-cart', bookId: this.book._id });
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.book._id).subscribe();
    } else {
      this.wishlistService.addToWishlist(this.book._id).subscribe();
    }
    this.bookAction.emit({ action: 'toggle-wishlist', bookId: this.book._id });
  }
}