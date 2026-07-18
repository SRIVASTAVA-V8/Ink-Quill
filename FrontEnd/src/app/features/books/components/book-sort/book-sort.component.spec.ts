import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSortComponent } from './book-sort.component';

describe('BookSortComponent', () => {
  let component: BookSortComponent;
  let fixture: ComponentFixture<BookSortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookSortComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
