import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CartService } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';
import { AuthService } from '../../../../services/auth.service';
import { Address, Pricing } from '../../../../models/order.model';
import { Cart } from '../../../../models/cart.model';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  checkoutForm: FormGroup;
  cart: Cart = { 
    _id: '',
    userId: null,
    sessionId: '',
    items: [],
    totalAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  processing = false;
  currentStep = 1;
  totalSteps = 3;
  razorpayLoaded = false;
  
  paymentMethods = [
    { value: 'CARD', label: 'Card Payment', icon: 'credit_card', description: 'Debit / Credit Card' },
    { value: 'UPI', label: 'UPI', icon: 'smartphone', description: 'Google Pay, PhonePe, etc.' },
    { value: 'COD', label: 'Cash on Delivery', icon: 'cash', description: 'Pay when you receive' },
    { value: 'WALLET', label: 'Wallet', icon: 'account_balance_wallet', description: 'BookNest Wallet' }
  ];

  // Enterprise trust badges
  trustBadges = [
    { icon: 'security', label: '256-bit Encryption' },
    { icon: 'verified', label: 'Verified Merchant' },
    { icon: 'payment', label: 'Secure Payments' },
    { icon: 'support', label: '24/7 Support' }
  ];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      personalInfo: this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
      }),
      shippingAddress: this.fb.group({
        addressLine: ['', [Validators.required, Validators.minLength(5)]],
        apartment: [''],
        city: ['', [Validators.required, Validators.minLength(2)]],
        state: ['', [Validators.required, Validators.minLength(2)]],
        pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{5,6}$/)]],
        country: ['United States', [Validators.required]]
      }),
      payment: this.fb.group({
        method: ['CARD', Validators.required],
        cardNumber: [''],
        expiryDate: [''],
        cvv: [''],
        upiId: [''],
        savePaymentInfo: [false]
      })
    });
  }
  ngOnInit() {
    this.loadCart();
    this.loadUserData();
    this.setupPaymentValidators();
    this.loadRazorpayScript();
  }

  ngAfterViewInit() {}

  loadRazorpayScript() {
    if (typeof Razorpay !== 'undefined') {
      this.razorpayLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { this.razorpayLoaded = true; };
    document.body.appendChild(script);
  }

  loadCart() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  loadUserData() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        personalInfo: {
          fullName: user.name || '',
          email: user.email || '',
          phone: user.address?.phone || ''
        },
        shippingAddress: {
          addressLine: user.address?.addressLine || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
          country: user.address?.country || 'India'
        }
      });
    }
  }

  setupPaymentValidators() {
    const paymentGroup = this.checkoutForm.get('payment') as FormGroup;
    
    paymentGroup.get('method')?.valueChanges.subscribe(method => {
      this.updatePaymentValidators(method);
    });
  }

  updatePaymentValidators(method: string) {
    const paymentGroup = this.checkoutForm.get('payment') as FormGroup;
    
    paymentGroup.get('cardNumber')?.clearValidators();
    paymentGroup.get('expiryDate')?.clearValidators();
    paymentGroup.get('cvv')?.clearValidators();
    paymentGroup.get('upiId')?.clearValidators();
    
    if (method === 'CARD') {
      paymentGroup.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
      paymentGroup.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]);
      paymentGroup.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
    } else if (method === 'UPI') {
      paymentGroup.get('upiId')?.setValidators([Validators.required, Validators.email]);
    }
    
    Object.keys(paymentGroup.controls).forEach(key => {
      paymentGroup.get(key)?.updateValueAndValidity();
    });
  }

  get personalInfo(): FormGroup {
    return this.checkoutForm.get('personalInfo') as FormGroup;
  }

  get shippingAddress(): FormGroup {
    return this.checkoutForm.get('shippingAddress') as FormGroup;
  }

  get payment(): FormGroup {
    return this.checkoutForm.get('payment') as FormGroup;
  }

  getSubtotal(): number {
    return this.cart.totalAmount || 0;
  }

  getShippingCost(): number {
    return this.cart.totalAmount > 50 ? 0 : 5;
  }

  getDiscount(): number {
    let discount = 0;
    if (this.cart.items) {
      this.cart.items.forEach(item => {
        if (item.book?.discount) {
          discount += (item.book.price * item.book.discount / 100) * item.quantity;
        }
      });
    }
    return discount;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() - this.getDiscount();
  }

  getPricing(): Pricing {
    return {
      subtotal: this.getSubtotal(),
      discount: this.getDiscount(),
      deliveryCharges: this.getShippingCost(),
      total: this.getTotal()
    };
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      if (this.currentStep === 1 && !this.personalInfo.valid) {
        this.markFormGroupTouched(this.personalInfo);
        return;
      }
      if (this.currentStep === 2 && !this.shippingAddress.valid) {
        this.markFormGroupTouched(this.shippingAddress);
        return;
      }
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  canProceed(): boolean {
    switch(this.currentStep) {
      case 1: return this.personalInfo.valid;
      case 2: return this.shippingAddress.valid;
      case 3: return this.payment.valid;
      default: return false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getAddress(): Address {
    return {
      fullName: this.personalInfo.get('fullName')?.value,
      phone: this.personalInfo.get('phone')?.value,
      addressLine: this.shippingAddress.get('addressLine')?.value,
      city: this.shippingAddress.get('city')?.value,
      state: this.shippingAddress.get('state')?.value,
      pincode: this.shippingAddress.get('pincode')?.value,
      country: this.shippingAddress.get('country')?.value
    };
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    if (this.cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const paymentMethod = this.payment.get('method')?.value;

    if (paymentMethod === 'COD') {
      this.placeCODOrder();
      return;
    }

    this.initiateRazorpayPayment();
  }

  initiateRazorpayPayment() {
    this.processing = true;
    const address = this.getAddress();
    const pricing = this.getPricing();

    this.orderService.createRazorpayOrder({
      amount: pricing.total,
      currency: 'USD',
      receipt: `order_${Date.now()}`
    }).subscribe({
      next: (response: any) => {
        const options = {
          key: response.keyId,
          amount: response.amount,
          currency: response.currency,
          name: 'BookNest',
          description: 'Secure Book Purchase',
          image: 'assets/images/logo.png',
          order_id: response.orderId,
          handler: (paymentResponse: any) => {
            this.handleRazorpaySuccess(paymentResponse, address, pricing, response.orderId);
          },
          modal: {
            ondismiss: () => { this.processing = false; }
          },
          prefill: {
            name: this.personalInfo.get('fullName')?.value,
            email: this.personalInfo.get('email')?.value,
            contact: this.personalInfo.get('phone')?.value
          },
          theme: {
            color: '#1a1a1a'
          }
        };

        const razorpay = new Razorpay(options);
        razorpay.open();
        this.processing = false;
      },
      error: (error) => {
        this.processing = false;
        console.error('Payment initiation failed:', error);
      }
    });
  }

  handleRazorpaySuccess(paymentResponse: any, address: Address, pricing: Pricing, razorpayOrderId: string) {
    this.processing = true;

    this.orderService.verifyRazorpayPayment({
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
      orderDetails: { address, pricing, items: this.cart.items }
    }).subscribe({
      next: (verificationResponse) => {
        if (verificationResponse.success) {
          this.orderService.createOrder(
            address,
            'CARD',
            this.cart.items,
            pricing,
            {
              razorpayOrderId: razorpayOrderId,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              status: 'paid'
            }
          ).subscribe({
            next: (order) => {
              this.processing = false;
              this.router.navigate(['/orders', order._id]);
            },
            error: (error) => {
              this.processing = false;
              console.error('Order creation failed:', error);
            }
          });
        } else {
          this.processing = false;
          alert('Payment verification failed. Please try again.');
        }
      },
      error: (error) => {
        this.processing = false;
        console.error('Payment verification error:', error);
      }
    });
  }

  placeCODOrder() {
    this.processing = true;
    const address = this.getAddress();
    const pricing = this.getPricing();

    this.orderService.createOrder(
      address,
      'COD',
      this.cart.items,
      pricing,
      { status: 'pending' }
    ).subscribe({
      next: (order) => {
        this.processing = false;
        this.router.navigate(['/orders', order._id]);
      },
      error: (error) => {
        this.processing = false;
        console.error('Order failed:', error);
      }
    });
  }
}