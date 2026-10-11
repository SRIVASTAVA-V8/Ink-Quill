import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from 'src/app/guards/admin.guard';
import { AdminLayoutComponent } from './pages/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminOrderDetailsComponent } from './pages/admin-order-details/admin-order-details.component';
import { AdminInventoryComponent } from './pages/admin-inventory/admin-inventory.component';
import { AdminPaymentsComponent } from './pages/admin-payments/admin-payments.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      },
      {
        path: 'orders',
        component: AdminOrdersComponent
      },
      {
        path: 'orders/:id',
        component: AdminOrderDetailsComponent
      },
      {
        path: 'books',
        component: AdminInventoryComponent,
        data: { view: 'books' }
      },
      {
        path: 'inventory',
        component: AdminInventoryComponent,
        data: { view: 'inventory' }
      },
      {
        path: 'payments',
        component: AdminPaymentsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
