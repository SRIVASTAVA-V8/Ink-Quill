import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminService } from 'src/app/services/admin.service';
import { AdminBook } from 'src/app/models/admin.model';

type StockOperation = 'add' | 'subtract' | 'set';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit {
  books: AdminBook[] = [];
  loading = true;
  error = '';
  threshold = 10;
  isFormOpen = false;
  isEditing = false;
  selectedBook: AdminBook | null = null;
  stockOperation: StockOperation = 'add';
  stockAdjustValue = 0;
  searchTerm = '';

  bookForm = {
    title: '',
    author: '',
    price: 0,
    category: 'Fiction',
    stock: 0,
    description: '',
    ISBN: '',
    discount: 0,
    language: 'English',
    publisher: '',
    publishedDate: '',
    tags: ''
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  resetForm(): void {
    this.isFormOpen = false;
    this.isEditing = false;
    this.selectedBook = null;
    this.stockOperation = 'add';
    this.stockAdjustValue = 0;
    this.bookForm = {
      title: '',
      author: '',
      price: 0,
      category: 'Fiction',
      stock: 0,
      description: '',
      ISBN: '',
      discount: 0,
      language: 'English',
      publisher: '',
      publishedDate: '',
      tags: ''
    };
  }

  openCreateForm(): void {
    this.resetForm();
    this.isFormOpen = true;
  }

  openEditForm(book: AdminBook): void {
    this.selectedBook = book;
    this.isEditing = true;
    this.isFormOpen = true;
    this.bookForm = {
      title: book.title || '',
      author: book.author || '',
      price: book.price || 0,
      category: book.category || 'Fiction',
      stock: book.stock || 0,
      description: book.description || '',
      ISBN: book.ISBN || '',
      discount: book.discount || 0,
      language: book.language || 'English',
      publisher: '',
      publishedDate: book.publishedDate ? new Date(book.publishedDate).toISOString().slice(0, 10) : '',
      tags: ''
    };
  }

  submitBookForm(): void {
    const payload = {
      title: this.bookForm.title.trim(),
      author: this.bookForm.author.trim(),
      price: Number(this.bookForm.price),
      category: this.bookForm.category,
      stock: Number(this.bookForm.stock),
      description: this.bookForm.description.trim(),
      ISBN: this.bookForm.ISBN.trim(),
      discount: Number(this.bookForm.discount || 0),
      language: this.bookForm.language,
      publisher: this.bookForm.publisher.trim(),
      publishedDate: this.bookForm.publishedDate || undefined,
      tags: this.bookForm.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    const request = this.isEditing && this.selectedBook
      ? this.adminService.updateBook(this.selectedBook._id, payload)
      : this.adminService.createBook(payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadInventory();
      },
      error: (err) => {
        console.error('Failed to save book:', err);
      }
    });
  }

  loadInventory(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getInventory(1, 20)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.books = response.books || [];
        },
        error: (err) => {
          console.error('Failed to load inventory:', err);
          this.error = 'Unable to load inventory.';
        }
      });
  }

  loadLowStockAlerts(): void {
    this.adminService.getLowStockAlerts(this.threshold).subscribe({
      next: (response) => {
        this.books = response.lowStockBooks || [];
      },
      error: (err) => {
        console.error('Failed to load low stock alerts:', err);
      }
    });
  }

  updateStock(book: AdminBook): void {
    const quantity = Number(this.stockAdjustValue);
    if (Number.isNaN(quantity) || quantity < 0) {
      return;
    }

    this.adminService.updateInventoryStock(book._id, quantity, this.stockOperation).subscribe({
      next: () => {
        this.stockAdjustValue = 0;
        this.loadInventory();
      },
      error: (err) => {
        console.error('Failed to update stock:', err);
      }
    });
  }

  deleteBook(book: AdminBook): void {
    if (!window.confirm(`Delete ${book.title}?`)) {
      return;
    }

    this.adminService.deleteBook(book._id).subscribe({
      next: () => {
        this.books = this.books.filter((item) => item._id !== book._id);
      },
      error: (err) => {
        console.error('Failed to delete book:', err);
      }
    });
  }

  getVisibleBooks(): AdminBook[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.books;
    }

    return this.books.filter((book) =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
  }

  formatCurrency(amount = 0): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  }
}
