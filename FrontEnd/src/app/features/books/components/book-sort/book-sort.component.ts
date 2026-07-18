import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-book-sort',
  templateUrl: './book-sort.component.html',
  styleUrls: ['./book-sort.component.css']
})
export class BookSortComponent {
  @Output() sortChanged = new EventEmitter<string>();

  onSortChange(event: any) {
    this.sortChanged.emit(event.target.value);
  }

}
