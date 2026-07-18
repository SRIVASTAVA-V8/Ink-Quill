import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Order, Address, Pricing, OrderItem } from '../models/order.model';
import { Book } from '../models/book.model';
import{CartItem,Cart} from '../models/cart.model';
import { DUMMY_ORDERS } from '../services/dummy-data';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.loadOrdersFromStorage();
  }

  private loadOrdersFromStorage(): void {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      this.ordersSubject.next(JSON.parse(storedOrders));
    } else {
      this.ordersSubject.next(DUMMY_ORDERS);
      localStorage.setItem('orders', JSON.stringify(DUMMY_ORDERS));
    }
  }

  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  createOrder(
    shippingAddress: Address,
    paymentMethod: 'CARD' | 'UPI' | 'COD' | 'WALLET',
    cartItems: CartItem[],
    pricing: Pricing
  ): Observable<Order> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User must be logged in to place order');
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
      bookId: item.bookId,
      title: item.book?.title || 'Unknown Book',
      quantity: item.quantity,
      price: item.priceAtAddTime
    }));

    const newOrder: Order = {
      _id: `order_${Date.now()}`,
      userId: currentUser._id,
      items: orderItems,
      shippingAddress: shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: paymentMethod === 'COD' ? 'pending' : 'paid',
        paidAt: paymentMethod !== 'COD' ? new Date() : undefined
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
    this.cartService.clearCart().subscribe();
    
    return of(newOrder).pipe(delay(1000));
  }

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

  getOrder(id: string): Observable<Order | undefined> {
    const order = this.ordersSubject.value.find(o => o._id === id);
    return of(order).pipe(delay(300));
  }

  cancelOrder(id: string): Observable<Order> {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex(o => o._id === id);
    
    if (orderIndex !== -1 && orders[orderIndex].orderStatus === 'placed') {
      orders[orderIndex].orderStatus = 'cancelled';
      orders[orderIndex].updatedAt = new Date();
      this.saveOrdersToStorage(orders);
      return of(orders[orderIndex]).pipe(delay(500));
    }
    
    throw new Error('Order cannot be cancelled');
  }
}