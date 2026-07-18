import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { BooksListComponent } from './pages/books-list/books-list.component';

const routes: Routes = [
  {
    path: '',
    component: BooksListComponent
  },
  {
    path: ':id',
    component: BookDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
