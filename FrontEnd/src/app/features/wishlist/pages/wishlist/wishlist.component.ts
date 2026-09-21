import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Wishlist } from 'src/app/models/wishlist.model';
import { WishlistService } from '../../../../services/wishlist.service';
import { CartService } from '../../../../services/cart.service';
import { Router } from '@angular/router';
import { Book } from '../../../../models/book.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlist: Wishlist | null = null;
  loading = true;
  private wishlistSubscription?: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private NotificationService:NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.wishlistSubscription = this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlist = wishlist;
    });
    this.loadWishlist();
  }

  ngOnDestroy() {
    this.wishlistSubscription?.unsubscribe();
  }
  loadWishlist(): void {
    this.loading = true;
    this.wishlistService.loadWishlist().subscribe({
      next: (wishlist) => {
        this.wishlist = wishlist;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load wishlist:', error);
        this.loading = false;
      }
    });
  }

  getDiscountedPrice(book: Book | undefined): number {
    if (!book) return 0;
    return book.discount > 0 ? 
      book.price - (book.price * book.discount / 100) : 
      book.price;
  }

  getTotalValue(): number {
    if (!this.wishlist) return 0;
    return this.wishlist.items.reduce((total, item) => {
      return total + (this.getDiscountedPrice(item.book) || 0);
    }, 0);
  }

  getInStockCount(): number {
    if (!this.wishlist) return 0;
    return this.wishlist.items.filter(item => 
      item.book?.stock && item.book.stock > 0
    ).length;
  }

  addToCart(bookId: string, event?: Event): void {

    if (event) {
      event.stopPropagation();
    }

    const wishlistItem = this.wishlist?.items.find(
      item => item.bookId === bookId
    );

    if (!wishlistItem) {
      console.error('Wishlist item not found:', bookId);
      return;
    }

    if (!wishlistItem.book) {
      console.error('Book details not available:', bookId);
      return;
    }

    if (wishlistItem.book.stock <= 0) {
      return;
    }

    this.cartService.addToCart(bookId, 1).subscribe({
      next: () => {
        this.NotificationService.success("Added to Cart");
        console.log('Added to cart:', bookId);
      },
      error: error => {
        this.NotificationService.error("Failed to add book to cart");
        console.error('Failed to add book to cart:', error);
      }
    });
  }

  removeFromWishlist(bookId: string, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    
    this.wishlistService.removeFromWishlist(bookId).subscribe({
        next: (wishlist) => {
          this.wishlist = wishlist;
          this.NotificationService.success("Removed from wishlist");
          console.log('Removed from wishlist:', bookId);
        },
        error: error => {
          this.NotificationService.error("Failed to remove from wishlist");
          console.error('Failed to remove from wishlist:', error);
      }
    });
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          this.NotificationService.success("Wishlist cleared successfully");
          console.log('Wishlist cleared successfully');
        },
        error: (error) => {
          this.NotificationService.error("Failed to clear wishlist");
          console.error('Failed to clear wishlist:', error);
        }
      });
    }
  }

  addAllToCart(): void {

    const itemsToAdd = this.wishlist?.items.filter(item =>
      item.book &&
      item.book.stock > 0
    ) || [];

    if (itemsToAdd.length === 0) {
      alert('No items in stock to add to cart');
      return;
    }

    if (!confirm(`Add all ${itemsToAdd.length} items to cart?`)) {
      return;
    }

    const cartRequests = itemsToAdd.map(item =>
      this.cartService.addToCart(item.bookId, 1)
    );

    forkJoin(cartRequests).subscribe({
      next: () => {
        this.NotificationService.success("All wishlist items added to cart")
        console.log('All wishlist items added to cart');
        this.router.navigate(['/cart']);
      },
      error: error => {
        this.NotificationService.error("Failed to add all wishlist items to cart")
        console.error('Failed to add all wishlist items to cart:', error);
      }
    });
  }
}