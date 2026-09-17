import { Component, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'myApp';
  constructor(private cartService: CartService) {}
  ngOnInit():void  {
    this.cartService.loadCart().subscribe({error: error=>{
      console.log('Failed to load cart:', error);
    }
  });
}
}
