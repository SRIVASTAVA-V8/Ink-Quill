import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';
  tracking: { orderStatus?: string; shippingInfo?: any; deliveredAt?: Date | null } | null = null;
  trackingLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');

    if (!orderId) {
      this.router.navigate(['/orders']);
      return;
    }

    this.loadOrder(orderId);
  }

  loadOrder(orderId: string): void {
    this.loading = true;
    this.error = '';

    this.orderService.getOrder(orderId).subscribe({
      next: (response: any) => {
        this.order = response.orderDetails || response.order || null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load order details:', err);
        this.error = 'Unable to load this order.';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  trackOrder(): void {
    if (!this.order?._id) {
      return;
    }

    this.trackingLoading = true;

    this.orderService.trackOrder(this.order._id).subscribe({
      next: (response: any) => {
        this.tracking = response.tracking || null;
        this.trackingLoading = false;
      },
      error: (err) => {
        console.error('Failed to load order tracking:', err);
        this.tracking = null;
        this.trackingLoading = false;
      }
    });
  }

  getPaymentLabel(method: string | undefined): string {
    if (!method) return 'N/A';
    return method.toUpperCase();
  }
}
