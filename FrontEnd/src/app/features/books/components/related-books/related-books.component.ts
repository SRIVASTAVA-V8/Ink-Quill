import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';

import {
  Book,
  RelatedBooks
} from 'src/app/models/book.model';

import {
  BookService
} from 'src/app/services/book.service';


@Component({
  selector: 'app-related-books',
  templateUrl: './related-books.component.html',
  styleUrls: ['./related-books.component.css']
})
export class RelatedBooksComponent
  implements OnInit, OnChanges {

  @Input() book!: Book;

  loadingRelated = true;

  relatedBooks: RelatedBooks | null = null;


  constructor(
    private bookService: BookService
  ) {}


  ngOnInit(): void {

    if (this.book?._id) {
      this.loadRelatedBooks();
    }

  }


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['book'] &&
      this.book?._id
    ) {

      this.loadRelatedBooks();

    }

  }


  private loadRelatedBooks(): void {

    this.loadingRelated = true;

    this.relatedBooks = null;


    this.bookService
      .getRelatedBooks(this.book)
      .subscribe({

        next: (related) => {

          this.relatedBooks = related;

          this.loadingRelated = false;

        },


        error: (error) => {

          console.error(
            'Failed to load related books:',
            error
          );

          this.relatedBooks = null;

          this.loadingRelated = false;

        }

      });

  }

}