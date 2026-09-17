import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { BookFilterComponent } from './components/book-filter/book-filter.component';
import { BookSortComponent } from './components/book-sort/book-sort.component';
import { BooksGridComponent } from './components/books-grid/books-grid.component';
import { RelatedBooksComponent } from './components/related-books/related-books.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReviewsComponent } from './components/reviews/reviews.component';


@NgModule({
  declarations: [
    BooksListComponent,
    BookDetailsComponent,
    BookFilterComponent,
    BookSortComponent,
    BooksGridComponent,
    RelatedBooksComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }
