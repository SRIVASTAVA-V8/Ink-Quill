import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  profileMenuOpen = false;

  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Users', route: '/admin/users' },
    { label: 'Books', route: '/admin/books' },
    { label: 'Inventory', route: '/admin/inventory' },
    { label: 'Orders', route: '/admin/orders' },
    { label: 'Payments', route: '/admin/payments' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get adminName(): string {
    return this.authService.getCurrentUser()?.name || 'Admin';
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  logout(): void {
    this.closeProfileMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
