import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Order,
  Address,
} from '../models/order.model';

import { environment } from '../../environments/environment';


export type PaymentMethod =
  | 'CARD'
  | 'UPI'
  | 'COD';


export interface CheckoutResponse {
  success: boolean;
  message: string;

  paymentMethod: PaymentMethod;

  order: Order

  razorpay?: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}


export interface VerifyPaymentRequest {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OrderHistoryResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly apiUrl =
    `${environment.apiUrl}/orders`;


  constructor(
    private http: HttpClient
  ) {}

  checkout(
    paymentMethod: PaymentMethod,
    shippingAddress: Address
  ): Observable<CheckoutResponse> {

    const result=  this.http.post<CheckoutResponse>(
      `${this.apiUrl}/checkout`,
      {
        paymentMethod: paymentMethod.toLowerCase(),
        shippingAddress
      }
    );
    console.log('Checkout Response:', result);
    return result;
  }

  verifyPayment(
    data: VerifyPaymentRequest
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/verify-payment`,
      data
    );
  }

  paymentFailed(
    orderId: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/payment-failed`,
      { orderId }
    );
  }

  getOrders(
    page: number = 1,
    limit: number = 10
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/history`,
      {
        params: {
          page,
          limit
        }
      }
    );
  }


  getOrder(
    orderId: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/details/${orderId}`
    );
  }

  trackOrder(
    orderId: string
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/track/${orderId}`
    );
  }

}