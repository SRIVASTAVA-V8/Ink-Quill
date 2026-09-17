import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
// import { AuthGuard } from '../../../core/guards/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component: WishlistComponent,
    // canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WishlistRoutingModule { }