import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searchTerm = '';

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  search(): void {

    const term = this.searchTerm.trim();

    this.searchService.setSearchTerm(term);

    if (this.router.url !== '/books') {
      this.router.navigate(['/books']);
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch();
  }
}