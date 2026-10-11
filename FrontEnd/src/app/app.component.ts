import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from './services/cart.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'myApp';
  isAdminRoute = false;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit():void  {
    this.isAdminRoute = this.router.url.startsWith('/admin');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.isAdminRoute = (event as NavigationEnd).urlAfterRedirects.startsWith('/admin');
    });

    this.cartService.loadCart().subscribe({error: error=>{
      console.log('Failed to load cart:', error);
    }
  });
}
}
