import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, LoginData, RegisterData } from '../models/user.model';
import { DUMMY_USERS } from '../services/dummy-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginData: LoginData): Observable<User> {
    const user = DUMMY_USERS.find(u => u.email === loginData.email);
    
    if (user && user.password === loginData.password) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', 'dummy-jwt-token');
      this.currentUserSubject.next(userWithoutPassword as User);
      return of(userWithoutPassword as User).pipe(delay(500));
    }
    
    throw new Error('Invalid email or password');
  }

  register(registerData: RegisterData): Observable<User> {
    const existingUser = DUMMY_USERS.find(u => u.email === registerData.email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      _id: `user_${Date.now()}`,
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    localStorage.setItem('token', 'dummy-jwt-token');
    this.currentUserSubject.next(userWithoutPassword as User);
    
    return of(userWithoutPassword as User).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
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