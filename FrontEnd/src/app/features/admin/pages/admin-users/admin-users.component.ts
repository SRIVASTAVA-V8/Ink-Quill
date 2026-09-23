import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AdminService } from 'src/app/services/admin.service';
import { AdminUser } from 'src/app/models/admin.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  error = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.adminService.getUsers()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          this.users = response.users || [];
        },
        error: (err) => {
          console.error('Failed to load users:', err);
          this.error = 'Unable to load users.';
        }
      });
  }

  toggleUserStatus(user: AdminUser): void {
    this.adminService.updateUserStatus(user._id, !user.isActive).subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: (err) => {
        console.error('Failed to update user status:', err);
      }
    });
  }

  changeRole(user: AdminUser): void {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';

    this.adminService.updateUserRole(user._id, nextRole).subscribe({
      next: (response) => {
        user.role = response.user.role;
      },
      error: (err) => {
        console.error('Failed to change user role:', err);
      }
    });
  }
}
