import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import {
  AdminBook,
  AdminBookSearchFilters,
  AdminDashboardSummary,
  AdminInventoryResponse,
  AdminOrder,
  AdminUser,
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<AdminDashboardSummary> {
    return this.http.get<AdminDashboardSummary>(`${this.API_URL}/dashboard`);
  }

  getUsers(): Observable<{ users: AdminUser[] }> {
    return this.http.get<{ users: AdminUser[] }>(`${this.API_URL}/users`);
  }

  getUserById(userId: string): Observable<{ user: AdminUser }> {
    return this.http.get<{ user: AdminUser }>(`${this.API_URL}/users/${userId}`);
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<{ user: AdminUser }> {
    return this.http.patch<{ user: AdminUser }>(`${this.API_URL}/users/${userId}/role`, { role });
  }

  updateUserStatus(userId: string, isActive: boolean): Observable<{ user: AdminUser }> {
    return this.http.patch<{ user: AdminUser }>(`${this.API_URL}/users/${userId}/status`, { isActive });
  }

  getOrders(): Observable<{ orders: AdminOrder[] }> {
    return this.http.get<{ orders: AdminOrder[] }>(`${this.API_URL}/orders`);
  }

  getOrder(orderId: string): Observable<{ order: AdminOrder }> {
    return this.http.get<{ order: AdminOrder }>(`${this.API_URL}/orders/${orderId}`);
  }

  updateShipping(orderId: string, shippingData: {
    carrier: string;
    trackingNumber: string;
    estimatedDeliveryDate: string;
  }): Observable<{ order: AdminOrder }> {
    return this.http.patch<{ order: AdminOrder }>(`${this.API_URL}/orders/${orderId}/shipping`, shippingData);
  }

  markDelivered(orderId: string): Observable<{ order: AdminOrder }> {
    return this.http.patch<{ order: AdminOrder }>(`${this.API_URL}/orders/${orderId}/mark-delivered`, {});
  }

  trackShipping(orderId: string): Observable<{ tracking: any }> {
    return this.http.get<{ tracking: any }>(`${this.API_URL}/orders/${orderId}/track`);
  }

  getInventory(page = 1, limit = 20): Observable<AdminInventoryResponse> {
    return this.http.get<AdminInventoryResponse>(`${this.API_URL}/inventory`, {
      params: {
        page: page.toString(),
        limit: limit.toString()
      }
    });
  }

  getLowStockAlerts(threshold = 10): Observable<{ lowStockBooks: AdminBook[] }> {
    return this.http.get<{ lowStockBooks: AdminBook[] }>(`${this.API_URL}/inventory/alerts/low-stock`, {
      params: {
        threshold: threshold.toString()
      }
    });
  }

  getInventoryItem(bookId: string): Observable<{ book: AdminBook }> {
    return this.http.get<{ book: AdminBook }>(`${this.API_URL}/inventory/${bookId}`);
  }

  updateInventoryStock(bookId: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Observable<{ book: AdminBook }> {
    return this.http.patch<{ book: AdminBook }>(`${this.API_URL}/inventory/${bookId}/stock`, {
      quantity,
      operation
    });
  }

  updateProductDetails(bookId: string, details: Record<string, any>): Observable<{ book: AdminBook }> {
    return this.http.patch<{ book: AdminBook }>(`${this.API_URL}/inventory/${bookId}/details`, details);
  }

  createBook(bookData: Partial<AdminBook>): Observable<{ book: AdminBook }> {
    return this.http.post<{ book: AdminBook }>(`${this.API_URL}/inventory/add-book`, bookData);
  }

  updateBook(bookId: string, payload: Partial<AdminBook>): Observable<{ book: AdminBook }> {
    return this.http.put<{ book: AdminBook }>(`${this.API_URL}/inventory/${bookId}`, payload);
  }

  deleteBook(bookId: string): Observable<{ book: AdminBook }> {
    return this.http.delete<{ book: AdminBook }>(`${this.API_URL}/inventory/${bookId}`);
  }

  searchBooks(filters: AdminBookSearchFilters = {}): Observable<any> {
    return this.http.post(`${this.API_URL}/inventory/search`, filters);
  }
}
