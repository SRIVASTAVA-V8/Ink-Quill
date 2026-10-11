import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminOrder } from 'src/app/models/admin.model';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-payments',
  templateUrl: './admin-payments.component.html'
})
export class AdminPaymentsComponent implements OnInit {
  orders: AdminOrder[] = [];
  loading = true;
  error = '';
  statusFilter = 'all';
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getOrders()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => this.orders = response.orders || [],
        error: (err) => {
          console.error('Failed to load payment information:', err);
          this.error = 'Unable to load payment information.';
        }
      });
  }

  get filteredOrders(): AdminOrder[] {
    const search = this.searchTerm.trim().toLowerCase();
    return this.orders.filter((order) => {
      const status = (order.paymentInfo?.status || 'unknown').toLowerCase();
      const customer = order.userId && typeof order.userId !== 'string' ? order.userId.name || '' : '';
      const matchesStatus = this.statusFilter === 'all' || status === this.statusFilter;
      const matchesSearch = !search ||
        order._id.toLowerCase().includes(search) ||
        customer.toLowerCase().includes(search) ||
        (order.paymentInfo?.razorpayPaymentId || '').toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  get visibleOrders(): AdminOrder[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  resetPage(): void {
    this.currentPage = 1;
  }

  getCustomerName(order: AdminOrder): string {
    const user = order.userId;
    if (user && typeof user !== 'string' && user.name) {
      return user.name;
    }
    return order.shippingAddress?.fullName || 'Customer';
  }

  formatCurrency(amount = 0): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount || 0);
  }

  getStatusClasses(status?: string): string {
    switch ((status || '').toLowerCase()) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}