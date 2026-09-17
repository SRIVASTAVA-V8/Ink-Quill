
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { WishlistService } from '../../../services/wishlist.service';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  wishlistCount = 0;
  userMenuOpen = false;
  isLoggedIn$ = this.authService.currentUser$.pipe(map(user => !!user));
  currentUser$ = this.authService.currentUser$;
  isAdmin = false;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
     this.cartService.cart$.subscribe(cart => {
      this.cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    });
    
    this.wishlistService.wishlist$.subscribe(wishlist => {
      this.wishlistCount = wishlist.items.length;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.isAdmin = user?.role === 'admin';
    });
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeUserMenu();
  }
}