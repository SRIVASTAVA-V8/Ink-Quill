import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { User, LoginData, RegisterData } from '../models/user.model';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { environment } from 'src/environments/environment.prod';

interface LoginResponse {
  user: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/user`;

  private currentUserSubject =
    new BehaviorSubject<User | null>(
      this.getStoredUser()
    );

  public currentUser$ =
    this.currentUserSubject.asObservable();


  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}


  private getStoredUser(): User | null {

    const storedUser =
      localStorage.getItem('currentUser');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  }
 
  private handleAuthResponse(response: LoginResponse): User {
  const user: User = {
    _id: response.user.userId,
    name: response.user.name,
    email: response.user.email,
    role: response.user.role as any
  } as User;

  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('token', response.token);

  this.currentUserSubject.next(user);

  this.cartService.loadCart().subscribe({
    error: error => {
      console.error('Failed to load cart:', error);
    }
  });

  this.wishlistService.loadWishlist().subscribe({
    error: error => {
      console.error('Failed to load wishlist:', error);
    }
  });

  return user;
}

  login(loginData: LoginData): Observable<User> {

    return this.http.post<LoginResponse>(
      `${this.API_URL}/login`,
      loginData
    ).pipe(
    map(response => this.handleAuthResponse(response)),
    catchError(error => throwError(() => error))
  );
  }


  register(registerData: RegisterData): Observable<User> {
  return this.http.post<LoginResponse>(
    `${this.API_URL}/register`,
    registerData
  ).pipe(
    map(response => this.handleAuthResponse(response)),
    catchError(error => throwError(() => error))
  );
}


  logout(): void {

    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    this.currentUserSubject.next(null);
    this.cartService.loadCart().subscribe({error: error => { console.error('Failed to load cart after logout:', error); }});
    this.wishlistService.loadWishlist().subscribe({error: error => { console.error('Failed to load wishlist after logout:', error); }});
  }


  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }


  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }


  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

}