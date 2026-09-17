import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, delay, throwError } from 'rxjs';
import { Order, Address, Pricing, OrderItem } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';

export interface RazorpayOrderRequest {
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface RazorpayPaymentVerification {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderDetails: any;
}

export interface RazorpayPaymentInfo {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.ordersSubject.next(JSON.parse(storedOrders));
    }
  }

  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  // Create Razorpay Order
  createRazorpayOrder(orderData: RazorpayOrderRequest): Observable<RazorpayOrderResponse> {
    // In production, this would be an API call
    // return this.http.post<RazorpayOrderResponse>(`${this.apiUrl}/orders/create-razorpay-order`, orderData);
    
    // For demo with dummy data
    const mockResponse: RazorpayOrderResponse = {
      orderId: `order_${Date.now()}`,
      amount: orderData.amount * 100, // Razorpay expects amount in paise
      currency: orderData.currency || 'INR',
      keyId: 'rzp_test_1234567890' // Your Razorpay Key ID
    };
    return of(mockResponse).pipe(delay(500));
  }

  // Verify Razorpay Payment
  verifyRazorpayPayment(verificationData: RazorpayPaymentVerification): Observable<any> {
    // In production, this would be an API call
    // return this.http.post(`${this.apiUrl}/orders/verify-razorpay-payment`, verificationData);
    
    // For demo with dummy data
    return of({ success: true }).pipe(delay(500));
  }

  // Create Order
  createOrder(
    shippingAddress: Address,
    paymentMethod: 'CARD' | 'UPI' | 'COD' | 'WALLET',
    cartItems: CartItem[],
    pricing: Pricing,
    razorpayInfo?: Partial<RazorpayPaymentInfo>
  ): Observable<Order> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('User must be logged in to place order'));
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
      bookId: item.bookId,
      title: item.book?.title || 'Unknown Book',
      quantity: item.quantity,
      price: item.priceAtAddTime,
      book: item.book
    }));

    let paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' = 'pending';
    
    if (paymentMethod === 'COD') {
      paymentStatus = 'pending';
    } else if (razorpayInfo?.status) {
      paymentStatus = razorpayInfo.status as any;
    } else {
      paymentStatus = 'paid';
    }

    const newOrder: Order = {
      _id: `order_${Date.now()}`,
      userId: currentUser._id,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentStatus,
        razorpayOrderId: razorpayInfo?.razorpayOrderId || '',
        razorpayPaymentId: razorpayInfo?.razorpayPaymentId || '',
        razorpaySignature: razorpayInfo?.razorpaySignature || '',
        paidAt: paymentStatus === 'paid' ? new Date() : undefined
      },
      pricing: pricing,
      orderStatus: 'placed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentOrders = this.ordersSubject.value;
    const updatedOrders = [newOrder, ...currentOrders];
    this.saveOrdersToStorage(updatedOrders);
    
    // Clear cart after successful order
    this.cartService.clearCart();
    
    return of(newOrder).pipe(delay(1000));
  }

  // Get all orders for current user
  getOrders(): Observable<Order[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    const userOrders = this.ordersSubject.value.filter(
      order => order.userId === currentUser._id
    );
    return of(userOrders).pipe(delay(500));
  }

  // Get single order by ID
  getOrder(id: string): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o._id === id);
    return of(order).pipe(delay(300));
  }

  // Cancel order
  cancelOrder(id: string): Observable<Order> {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o._id === id);
    
    if (orderIndex !== -1 && orders[orderIndex].orderStatus === 'placed') {
      orders[orderIndex].orderStatus = 'cancelled';
      orders[orderIndex].updatedAt = new Date();
      this.saveOrdersToStorage(orders);
      return of(orders[orderIndex]).pipe(delay(500));
    }
    
    return throwError(() => new Error('Order cannot be cancelled'));
  }
}