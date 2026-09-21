import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Notification,
  NotificationService
} from 'src/app/services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html'
})
export class ToastComponent implements OnInit, OnDestroy {

  notification: Notification | null = null;

  private subscription?: Subscription;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscription =
      this.notificationService.notification$
        .subscribe(notification => {
          this.notification = notification;
        });
  }

  close(): void {
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}