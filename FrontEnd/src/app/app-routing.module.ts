import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home.component';
// import {AuthGuard} from './guards/auth.guard';
const routes: Routes = [

  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.module')
      .then(m => m.HomeModule)
  },

  {
    path: 'books',
    loadChildren: () =>
      import('./features/books/books.module')
      .then(m => m.BooksModule)
  },

  {
    path: 'cart',
    loadChildren: () =>
      import('./features/cart/cart.module')
      .then(m => m.CartModule)
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
      .then(m => m.AuthModule)
  },

  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
