import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], totalAmount: 0, createdAt: new Date(), updatedAt: new Date(), userId: null, sessionId: '' };

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  updateQuantity(bookId: string, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(bookId, quantity).subscribe();
    }
  }

  removeItem(bookId: string) {
    this.cartService.removeFromCart(bookId).subscribe();
  }

  getTotal(): number {
    const shipping = this.cart.totalAmount > 50 ? 0 : 5;
    return this.cart.totalAmount + shipping;
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

}
