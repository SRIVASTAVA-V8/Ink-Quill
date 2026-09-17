import { Component, Input, EventEmitter, Output,OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { Book } from 'src/app/models/book.model';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.css']
})
export class BookCardComponent implements OnDestroy {
  @Input() book!: Book;
  @Input() compact = false;
  @Input() wishlistMode = false;
  @Input() cartMode = false;
  @Input() cartQuantity = 1;
  @Input() cartPrice: number = 0;
  @Input() addedAt?: string | Date;

  @Output() bookAction = new EventEmitter<{ action: string; bookId: string }>();
  @Output()cartQuantityChange = new EventEmitter<number>();
  @Output() removeCartItem = new EventEmitter<void>()
  
  @Output() removeWishlist = new EventEmitter<Event>();
  isInWishlist = false;
  private wishlistSubscription?: Subscription;

  constructor(
  private cartService: CartService,
  private wishlistService: WishlistService
) {

  this.wishlistSubscription = this.wishlistService.wishlist$
    .subscribe(wishlist => {

      if (!this.book) {
        return;
      }

      this.isInWishlist =
        wishlist.items.some(
          item => item.bookId === this.book._id
        );

    });

}

  ngOnDestroy(): void {

    this.wishlistSubscription?.unsubscribe();

  }
  getDiscountedPrice(): number {

    return this.book.discount > 0
      ? this.book.price -
        (
          this.book.price *
          this.book.discount /
          100
        )
      : this.book.price;

  }

  addToCart(event: Event): void {

    event.stopPropagation();

    if (this.book.stock <= 0) {
      return;
    }

    this.cartService
      .addToCart(this.book._id, 1)
      .subscribe({

        next: () => {

          this.bookAction.emit({
            action: 'add-to-cart',
            bookId: this.book._id
          });

        },

        error: error => {

          console.error(
            'Failed to add book to cart:',
            error
          );

        }

      });

  }
  toggleWishlist(event: Event): void {

    event.stopPropagation();

    if (this.isInWishlist) {

      this.wishlistService
        .removeFromWishlist(this.book._id)
        .subscribe();

    } else {

      this.wishlistService
        .addToWishlist(this.book._id)
        .subscribe();

    }

    this.bookAction.emit({
      action: 'toggle-wishlist',
      bookId: this.book._id
    });

  }

  onRemoveWishlist(event: Event) {
  event.stopPropagation();
  this.removeWishlist.emit(event);
  }

  increaseQuantity(): void {

    if (
      this.cartQuantity < this.book.stock
    ) {

      this.cartQuantityChange.emit(
        this.cartQuantity + 1
      );

    }

  }


  decreaseQuantity(): void {

    if (this.cartQuantity > 1) {

      this.cartQuantityChange.emit(
        this.cartQuantity - 1
      );

    }

  }

}