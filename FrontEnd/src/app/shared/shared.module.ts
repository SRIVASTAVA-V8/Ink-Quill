import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BookCardComponent } from './book-card/book-card.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';  
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    BookCardComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    BookCardComponent
  ]
})
export class SharedModule { }
