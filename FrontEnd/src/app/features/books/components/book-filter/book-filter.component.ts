import { Component,EventEmitter,Output, } from '@angular/core';

@Component({
  selector: 'app-book-filter',
  templateUrl: './book-filter.component.html',
  styleUrls: ['./book-filter.component.css']
})
export class BookFilterComponent {
@Output() filtersChanged = new EventEmitter<any>();
  
  categories = ['All', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Romance', 'Mystery', 'Fantasy'];
  selectedCategory = 'All';
  maxPrice = 100;
  selectedRating = 0;

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.emitFilters();
  }

  onPriceChange() {
    this.emitFilters();
  }

  onRatingChange(rating: number) {
    this.selectedRating = rating;
    this.emitFilters();
  }

  clearFilters() {
    this.selectedCategory = 'All';
    this.maxPrice = 100;
    this.selectedRating = 0;
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      category: this.selectedCategory === 'All' ? null : this.selectedCategory,
      minPrice: 0,
      maxPrice: this.maxPrice,
      rating: this.selectedRating || null
    });
  }
}
