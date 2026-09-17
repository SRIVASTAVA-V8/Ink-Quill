import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchSubject = new BehaviorSubject<string>('');

  search$ = this.searchSubject.asObservable();

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  clearSearch(): void {
    this.searchSubject.next('');
  }
}
