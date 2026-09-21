import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject =
    new BehaviorSubject<Notification | null>(null);

  notification$ =
    this.notificationSubject.asObservable();

  show(
    message: string,
    type: NotificationType = 'success'
  ): void {

    this.notificationSubject.next({
      message,
      type
    });

    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  clear(): void {
    this.notificationSubject.next(null);
  }
}