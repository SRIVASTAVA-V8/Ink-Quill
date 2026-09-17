import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     const token = localStorage.getItem('token');
     const isAuthRequest =
      request.url.includes('/api/user/login') ||
      request.url.includes('/api/user/register');
  if (token && !isAuthRequest) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    request = request.clone({
      withCredentials: true
    });
  }
    return next.handle(request);
  }
}
