import { Component, OnInit } from '@angular/core';
import { OrderService, OrderHistoryResponse } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  page = 1;
  limit = 5;
  pagination = {
    page: 1,
    limit: 5,
    total: 0,
    pages: 0
  };

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrders(this.page, this.limit).subscribe({
      next: (response: OrderHistoryResponse) => {
        this.orders = response.orders || [];
        this.pagination = response.pagination || {
          page: this.page,
          limit: this.limit,
          total: 0,
          pages: 0
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order history:', err);
        this.error = 'Unable to load your orders right now.';
        this.loading = false;
      }
    });
  }

  getStatusClasses(status: string): string {
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

  getTotalItems(order: Order): number {
    return (order.items || []).reduce((sum, item) => sum + item.quantity, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  goToPage(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.pagination.pages || nextPage === this.page) {
      return;
    }

    this.page = nextPage;
    this.loadOrders();
  }
}
