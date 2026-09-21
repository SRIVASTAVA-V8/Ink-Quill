import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CartService } from '../../../../services/cart.service';
import { OrderService, PaymentMethod } from '../../../../services/order.service';
import { AuthService } from '../../../../services/auth.service';
import { Address, Pricing} from '../../../../models/order.model';
import { Cart } from '../../../../models/cart.model';
import { NotificationService } from 'src/app/services/notification.service';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
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
  {
    value: 'CARD',
    label: 'Card',
    icon: 'credit_card',
    description: 'Credit / Debit card'
  },
  {
    value: 'UPI',
    label: 'UPI',
    icon: 'smartphone',
    description: 'Google Pay, PhonePe'
  },
  {
    value: 'COD',
    label: 'Cash on Delivery',
    icon: 'payments',
    description: 'Pay on delivery'
  }
];

  // Enterprise trust badges
  trustBadges = [
    { icon: 'security', label: '256-bit Encryption' },
    { icon: 'verified', label: 'Verified Merchant' },
    { icon: 'payment', label: 'Secure Payments' },
    { icon: 'support', label: '24/7 Support' }
  ];
  pricing ={
    subtotal: 0,
    discount: 0,
    deliveryCharges: 0,
    tax: 0,
    total: 0
  }
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private NotificationService:NotificationService,
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
       method: ['CARD', Validators.required]
   })  
    });

  }
  ngOnInit() {
    this.loadCart();
    this.loadUserData();
    this.loadRazorpayScript();
    this.loadCheckoutPreview();
  }

  loadCheckoutPreview(): void {
    console.log('Loading checkout preview...');
  this.orderService.getCheckoutPreview().subscribe({
    next: response => {
      this.pricing = response.pricing;
    },
    error: error => {
      console.error(
        'Failed to load checkout pricing:',
        error
      );
    }
  });
}


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

  get personalInfo(): FormGroup {
    return this.checkoutForm.get('personalInfo') as FormGroup;
  }

  get shippingAddress(): FormGroup {
    return this.checkoutForm.get('shippingAddress') as FormGroup;
  }

  get payment(): FormGroup {
    return this.checkoutForm.get('payment') as FormGroup;
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

 placeOrder(): void {
  if (this.checkoutForm.invalid) {
    this.markFormGroupTouched(this.checkoutForm);
    return;
  }

  if (!this.cart.items.length) {
    alert('Your cart is empty.');
    return;
  }

  const paymentMethod =
    this.payment.get('method')?.value as PaymentMethod;
  const upiId =this.payment.get('upiId')?.value;

  const address = this.getAddress();

  this.processing = true;

   this.orderService.checkout(
    paymentMethod,
    address,
    upiId
  ).subscribe({
    next: response => {

      if (paymentMethod === 'COD') {
        this.processing = false;

         this.NotificationService.success('Order placed successfully. You will pay on delivery.');
         return ;
      }

      if (!response.razorpay) {
        this.processing = false;
        this.NotificationService.error('Unable to initialize payment.');
        return;
      }

      this.openRazorpay(
        response.order._id,
        response.razorpay
      );
    },

    error: error => {
      this.processing = false;
       this.NotificationService.error("Checkout Failed");
      console.error(   
        'Checkout failed:',
        error
      );
      // alert(
      //   error?.error?.message ||
      //   'Unable to place your order. Please try again.'
      // );
    }
  });
}

openRazorpay(
  orderId: string,
  razorpayOrder: {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
  }
): void {

  if (!this.razorpayLoaded) {
    this.processing = false;

    alert(
      'Payment gateway is still loading. Please try again.'
    );

    return;
  }

  const paymentMethod =
    this.payment.get('method')?.value;


  const options = {

    key: razorpayOrder.keyId,

    amount: razorpayOrder.amount,

    currency: razorpayOrder.currency,

    name: 'Ink & Quill',

    description: 'Your books, on their way',

    image: 'assets/images/logo.png',

    order_id: razorpayOrder.orderId,


    prefill: {
      name:
        this.personalInfo.get('fullName')?.value,

      email:
        this.personalInfo.get('email')?.value,

      contact:
        this.personalInfo.get('phone')?.value
    },


    theme: {
      color: '#28252a'
    },


    handler: (response: any) => {

      this.verifyRazorpayPayment(
        orderId,
        response
      );

    },


    modal: {

      ondismiss: () => {

        this.processing = false;

        this.orderService
          .paymentFailed(orderId)
          .subscribe({
            error: error =>{
              this.NotificationService.error('Failed to mark payment');
              console.error(
                'Failed to mark payment:',
                error
              )}
          });

      }

    }

  };


  const razorpay = new Razorpay(options);

  razorpay.open();
}

verifyRazorpayPayment(
  orderId: string,
  paymentResponse: any
): void {

  this.processing = true;

  this.orderService.verifyPayment({

    orderId,

    razorpayOrderId:
      paymentResponse.razorpay_order_id,

    razorpayPaymentId:
      paymentResponse.razorpay_payment_id,

    razorpaySignature:
      paymentResponse.razorpay_signature

  }).subscribe({

    next: response => {

      this.processing = false;

      if (response.success) {

        this.router.navigate([
          '/orders',
          orderId
        ]);

      } else {

        alert(
          'Payment verification failed.'
        );
      }

    },

    error: error => {

      this.processing = false;

      console.error(
        'Payment verification failed:',
        error
      );

      alert(
        error?.error?.message ||
        'Payment verification failed. Please contact support.'
      );

    }

  });
}

getAddress(): Address {

  return {
    fullName:
      this.personalInfo.get('fullName')?.value,

    phone:
      this.personalInfo.get('phone')?.value,

    addressLine:
      this.shippingAddress.get('addressLine')?.value,

    city:
      this.shippingAddress.get('city')?.value,

    state:
      this.shippingAddress.get('state')?.value,

    pincode:
      this.shippingAddress.get('pincode')?.value,

    country:
      this.shippingAddress.get('country')?.value
  };
}

}