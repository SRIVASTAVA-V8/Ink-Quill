import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/cart.model';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent
  implements OnInit, OnDestroy {

  // ==========================================
  // CART STATE
  // ==========================================

  cart: Cart = {
    items: [],
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null,
    sessionId: ''
  };


  loading = true;

  error = false;


  // Prevent multiple checkout clicks
  checkingOut = false;


  private cartSubscription?: Subscription;


  constructor(
    private cartService: CartService,
    private router: Router,
    private NotificationService: NotificationService
  ) {}

  ngOnInit(): void {

    this.loadCart();

  }


  // ==========================================
  // LOAD CART
  // ==========================================

  private loadCart(): void {

    this.cartSubscription?.unsubscribe();
    this.loading = true;
    this.error = false;


    this.cartSubscription =
      this.cartService
        .loadCart()
        .subscribe({

          next: (cart) => {

            this.cart = cart;

            this.loading = false;

          },


          error: (error) => {
             this.NotificationService.error('Failed to load Cart');
            console.error(
              'Failed to load cart:',
              error
            );

            this.error = true;
            this.loading = false;

          }

        });

  }
  updateQuantity(
    bookId: string,
    quantity: number
  ): void {

    // Invalid quantity
    if (quantity <= 0) {

      this.removeItem(bookId);

      return;

    }


    this.cartService
      .updateQuantity(bookId, quantity)
      .subscribe({

        next: (updatedCart) => {
          this.NotificationService.success('Quantity Updated Successfully');
          this.cart = updatedCart;

        },


        error: (error) => {
          this.NotificationService.error('Failed to Update Quantity');
          console.error(
            'Failed to update quantity:',
            error
          );

        }

      });

  }


  // ==========================================
  // REMOVE ITEM
  // ==========================================

  removeItem(bookId: string): void {

    this.cartService
      .removeFromCart(bookId)
      .subscribe({

        next: (updatedCart) => {
          this.NotificationService.success("Book removed from cart Successfully");
          this.cart = updatedCart;

        },


        error: (error) => {
          this.NotificationService.error("Failed to remove item");
          console.error(       
            'Failed to remove item:',
            error
          );

        }

      });

  }


  // ==========================================
  // SHIPPING
  // ==========================================

  getShipping(): number {

    // Free shipping on orders of ₹500 or more
    return this.cart.totalAmount >= 500
      ? 0
      : 50;

  }


  // ==========================================
  // GRAND TOTAL
  // ==========================================

  getTotal(): number {

    return (
      this.cart.totalAmount +
      this.getShipping()
    );

  }


  // ==========================================
  // CART ITEM COUNT
  // ==========================================

  getItemCount(): number {

    return this.cart.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }


  // ==========================================
  // CHECKOUT
  // ==========================================

  checkout(): void {

    // Don't checkout an empty cart
    if (!this.cart.items.length) {
      return;
    }


    // Prevent double-clicking
    if (this.checkingOut) {
      return;
    }


    this.checkingOut = true;


    this.router
      .navigate(['/checkout'])
      .finally(() => {

        this.checkingOut = false;

      });

  }


  // ==========================================
  // RETRY
  // ==========================================

  retryLoadCart(): void {

    this.loadCart();

  }
clearCart(): void {
  if (!this.cart || this.cart.items.length === 0) {
    return;
  }

  if (confirm('Are you sure you want to clear your cart?')) {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.NotificationService.success("Cart Cleared Successfully");
        console.log('Cart cleared successfully');
      },
      error: error => {
        this.NotificationService.success("Failed to Clear Cart");
        console.error('Failed to clear cart:', error);
      }
    });
  }
}

  ngOnDestroy(): void {

    this.cartSubscription?.unsubscribe();

  }

}