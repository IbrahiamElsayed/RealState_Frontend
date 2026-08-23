import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../services/admin-service';
import { AdminUser } from '../../models/admin-user';
import { PagedResult } from '../../../properties/models/paged-result';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);

  users: AdminUser[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  searchTerm = '';
  roleFilter = '';
  loading = true;
  actionError = '';

  private searchTimeout: any;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.actionError = '';

    this.adminService
      .getUsers(this.pageNumber, this.pageSize, this.searchTerm, this.roleFilter)
      .subscribe({
        next: (res: PagedResult<AdminUser>) => {
          this.users = res.items;
          this.totalCount = res.totalCount;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.actionError = 'Failed to load users.';
        },
      });
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.pageNumber = 1;
      this.loadUsers();
    }, 300);
  }

  onRoleFilterChange() {
    this.pageNumber = 1;
    this.loadUsers();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.pageNumber) return;
    this.pageNumber = page;
    this.loadUsers();
  }

  pages(): number[] {
    const total = this.totalPages;
    const current = this.pageNumber;
    const range: number[] = [];
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  onRoleChange(user: AdminUser, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value;

    if (newRole === user.role) return;

    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        user.role = newRole;
      },
      error: () => {
        this.actionError = `Failed to update role for "${user.userName}".`;
        select.value = user.role;
      },
    });
  }

  deleteUser(user: AdminUser) {
    if (!confirm(`Delete user "${user.userName}"? This cannot be undone.`)) return;

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: () => {
        this.actionError = `Cannot delete "${user.userName}" — they may have related properties or messages.`;
      },
    });
  }
}
