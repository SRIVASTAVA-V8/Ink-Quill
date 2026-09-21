import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { BookCardComponent } from './components/book-card/book-card.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';  
import { RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './toast/toast.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    BookCardComponent,
    SearchComponent,
    ClickOutsideDirective,
    ToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    BookCardComponent,
    SearchComponent,
    ToastComponent
  ]
})
export class SharedModule { }
