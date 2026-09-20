import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
 categories = [
  { name: 'Fiction', icon: 'menu_book' },
  { name: 'Romance', icon: 'favorite_border' },
  { name: 'Mystery', icon: 'search' },
  { name: 'Science', icon: 'science' },
  { name: 'Biography', icon: 'person_outline' },
  { name: 'Self Help', icon: 'psychology' },
  { name: 'History', icon: 'history_edu' }
];

  constructor(private router: Router) {}

  navigateToCategory(category: string) {
    this.router.navigate(['/books'], { queryParams: { category } });
  }
}
