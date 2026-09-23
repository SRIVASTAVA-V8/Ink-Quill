import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminService } from 'src/app/services/admin.service';
import { AdminOrder } from 'src/app/models/admin.model';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  loading = true;
  error = '';
  shippingOrder: AdminOrder | null = null;
  shippingForm = {
    carrier: '',
    trackingNumber: '',
    estimatedDeliveryDate: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getOrders()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.orders = response.orders || [];
        },
        error: (err) => {
          console.error('Failed to load orders:', err);
          this.error = 'Unable to load orders.';
        }
      });
  }

  openShippingForm(order: AdminOrder): void {
    this.shippingOrder = order;
    this.shippingForm = {
      carrier: order.shippingInfo?.carrier || '',
      trackingNumber: order.shippingInfo?.trackingNumber || '',
      estimatedDeliveryDate: order.shippingInfo?.estimatedDeliveryDate ? new Date(order.shippingInfo.estimatedDeliveryDate).toISOString().slice(0, 10) : ''
    };
  }

  updateShipping(): void {
    if (!this.shippingOrder) {
      return;
    }

    this.adminService.updateShipping(this.shippingOrder._id, {
      carrier: this.shippingForm.carrier,
      trackingNumber: this.shippingForm.trackingNumber,
      estimatedDeliveryDate: this.shippingForm.estimatedDeliveryDate
    }).subscribe({
      next: (response) => {
        this.shippingOrder = null;
        this.shippingForm = {
          carrier: '',
          trackingNumber: '',
          estimatedDeliveryDate: ''
        };
        this.loadOrders();
      },
      error: (err) => {
        console.error('Failed to update shipping details:', err);
      }
    });
  }

  trackShipping(order: AdminOrder): void {
    this.adminService.trackShipping(order._id).subscribe({
      next: (response) => {
        console.log('Shipping tracking response:', response);
      },
      error: (err) => {
        console.error('Failed to track shipping:', err);
      }
    });
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

  formatCurrency(amount = 0): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  getCustomerName(order: AdminOrder): string {
    const user = order.userId;
    if (user && typeof user !== 'string' && user.name) {
      return user.name;
    }
    return 'Customer';
  }

  markDelivered(order: AdminOrder): void {
    if (!order._id) {
      return;
    }

    this.adminService.markDelivered(order._id).subscribe({
      next: () => {
        order.orderStatus = 'delivered';
      },
      error: (err) => {
        console.error('Failed to mark order delivered:', err);
      }
    });
  }
}
