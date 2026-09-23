import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  navItems = [
    { label: 'Dashboard', route: '/admin/dashboard' },
    { label: 'Users', route: '/admin/users' },
    { label: 'Orders', route: '/admin/orders' },
    { label: 'Inventory', route: '/admin/inventory' }
  ];
}
