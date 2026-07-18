import { Component, Input } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
 @Input() bookId!: string;
  reviewForm: FormGroup;
  rating = 0;
  reviews: any[] = [];
  isLoggedIn = true;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load reviews from service
  }

  setRating(star: number) {
    this.rating = star;
  }

  submitReview() {
    if (this.reviewForm.valid && this.rating > 0) {
      // Submit review
      this.reviewForm.reset();
      this.rating = 0;
    }
  }
}
