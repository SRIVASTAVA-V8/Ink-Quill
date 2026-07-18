import { Component, Input, OnInit } from '@angular/core';
import { RelatedBooks } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-related-books',
  templateUrl: './related-books.component.html',
  styleUrls: ['./related-books.component.css']
})
export class RelatedBooksComponent implements OnInit {
  @Input() bookId!: string;
  @Input() author!: string;
  @Input() category!: string;
  
  relatedBooks: RelatedBooks | null = null;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getRelatedBooks(this.bookId).subscribe(related => {
      this.relatedBooks = related;
    });
  }
}