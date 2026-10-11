import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AdminOrder } from 'src/app/models/admin.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html'
})
export class AdminOrderDetailsComponent implements OnInit {
  order: AdminOrder | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.loading = false;
      this.error = 'Order ID is missing.';
      return;
    }

    this.adminService.getOrder(orderId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => this.order = response.order,
        error: (err) => {
          console.error('Failed to load order details:', err);
          this.error = 'Unable to load order details.';
        }
      });
  }

  get customerName(): string {
    const user = this.order?.userId;
    if (user && typeof user !== 'string' && user.name) {
      return user.name;
    }
    return this.order?.shippingAddress?.fullName || 'Customer';
  }

  get customerEmail(): string {
    const user = this.order?.userId;
    return user && typeof user !== 'string' ? user.email || '' : '';
  }

  formatCurrency(amount = 0): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  getStatusClasses(status?: string): string {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-amber-100 text-amber-700';
      case 'shipped':
        return 'bg-violet-100 text-violet-700';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}