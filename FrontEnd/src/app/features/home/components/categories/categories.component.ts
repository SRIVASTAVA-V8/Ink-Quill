import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
  categories = [
    { name: 'Fiction', icon: '📖', count: 1245 },
    { name: 'Non-Fiction', icon: '📚', count: 876 },
    { name: 'Sci-Fi', icon: '🚀', count: 654 },
    { name: 'Biography', icon: '👤', count: 543 },
    { name: 'Romance', icon: '💕', count: 987 },
    { name: 'Mystery', icon: '🔍', count: 765 },
    { name: 'Fantasy', icon: '🐉', count: 432 }
  ];

  constructor(private router: Router) {}

  navigateToCategory(category: string) {
    this.router.navigate(['/books'], { queryParams: { category } });
  }
}
