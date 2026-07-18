import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './pages/cart/cart.component';
// import { CartItemComponent } from './components/cart-item/cart-item.component';
// import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
// import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CartComponent],
  imports: [
    CommonModule,
    SharedModule,
    CartRoutingModule
  ]
})
export class CartModule { }
