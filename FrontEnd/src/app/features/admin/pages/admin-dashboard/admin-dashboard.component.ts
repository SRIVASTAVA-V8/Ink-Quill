import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminService } from 'src/app/services/admin.service';
import { AdminDashboardSummary } from 'src/app/models/admin.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary: AdminDashboardSummary = {
    userCount: 0,
    adminCount: 0,
    orderCount: 0,
    totalRevenue: 0
  };
  loading = true;
  error = '';

  revenueTrend = [
    { label: 'Mon', value: 3000 },
    { label: 'Tue', value: 5200 },
    { label: 'Wed', value: 4800 },
    { label: 'Thu', value: 6700 },
    { label: 'Fri', value: 9100 },
    { label: 'Sat', value: 7600 },
    { label: 'Sun', value: 10200 }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getDashboardSummary()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.summary = data;
          this.revenueTrend = this.buildRevenueTrend(data.totalRevenue);
        },
        error: (err) => {
          console.error('Failed to load dashboard summary:', err);
          this.error = 'Unable to load dashboard summary.';
        }
      });
  }

  buildRevenueTrend(totalRevenue: number) {
    const base = totalRevenue > 0 ? totalRevenue / 7 : 6800;
    return [
      { label: 'Mon', value: Math.round(base * 0.4) },
      { label: 'Tue', value: Math.round(base * 0.68) },
      { label: 'Wed', value: Math.round(base * 0.52) },
      { label: 'Thu', value: Math.round(base * 0.81) },
      { label: 'Fri', value: Math.round(base * 1.1) },
      { label: 'Sat', value: Math.round(base * 0.93) },
      { label: 'Sun', value: Math.round(base * 1.25) }
    ];
  }

  getMaxRevenue(): number {
    return Math.max(...this.revenueTrend.map((item) => item.value), 1);
  }

  getAverageOrderValue(): number {
    return this.summary.totalRevenue / Math.max(this.summary.orderCount, 1);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }
}
