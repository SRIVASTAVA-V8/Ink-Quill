import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, RelatedBooks } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
book: Book | null = null;
  quantity = 1;
  isInWishlist = false;
  relatedBooks: RelatedBooks | null = null;
  authorBestsellers: Book[] = [];
  loadingRelated = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    const bookId = this.route.snapshot.params['id'];
    this.bookService.getBook(bookId).subscribe(book => {
      this.book = book || null;
      this.checkWishlistStatus();
    });
  }

  loadBookDetails(bookId: string) {
    this.loadingRelated = true;
    
    this.bookService.getBook(bookId).subscribe(book => {
      this.book = book || null;
      
      if (this.book) {
        this.checkWishlistStatus();
        this.loadRelatedBooks(bookId);
        this.loadAuthorBestsellers(this.book.author);
      }
    });
  }

  loadRelatedBooks(bookId: string) {
    this.bookService.getRelatedBooks(bookId).subscribe(related => {
      this.relatedBooks = related;
      this.loadingRelated = false;
    });
  }

  loadAuthorBestsellers(author: string) {
    this.bookService.getBestsellersByAuthor(author).subscribe(books => {
      // Exclude current book if it's in the list
      this.authorBestsellers = books.filter(b => b._id !== this.book?._id);
    });
  }

  checkWishlistStatus() {
    if (this.book) {
      this.isInWishlist = this.wishlistService.isInWishlist(this.book._id);
    }
  }

  incrementQuantity() {
    if (this.book && this.quantity < this.book.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.book) {
      this.cartService.addToCart(this.book._id, this.quantity).subscribe();
    }
  }

  toggleWishlist() {
    if (this.book) {
      if (this.isInWishlist) {
        this.wishlistService.removeFromWishlist(this.book._id).subscribe(() => {
          this.isInWishlist = false;
        });
      } else {
        this.wishlistService.addToWishlist(this.book._id).subscribe(() => {
          this.isInWishlist = true;
        });
      }
    }
  }

  getDiscountedPrice(): number {
    if (!this.book) return 0;
    return this.book.discount > 0 ? 
      this.book.price - (this.book.price * this.book.discount / 100) : 
      this.book.price;
  }

  goBack() {
    this.router.navigate(['/books']);
  }
}
