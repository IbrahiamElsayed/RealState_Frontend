import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AdminService,
  AdminProperty,
  PropertyModerationStatus,
} from '../../services/admin-service';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-properties.html',
  styleUrl: './admin-properties.css',
})
export class AdminProperties implements OnInit {
  adminService = inject(AdminService);

  properties: AdminProperty[] = [];
  statusFilter: PropertyModerationStatus | '' = '';
  loading = true;
  actionError = '';

  tabs: { label: string; value: PropertyModerationStatus | '' }[] = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.loading = true;
    this.actionError = '';

    this.adminService
      .getProperties(this.statusFilter || undefined)
      .subscribe({
        next: (res) => {
          this.properties = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.actionError = 'Failed to load properties.';
        },
      });
  }

  setStatus(status: PropertyModerationStatus | '') {
    this.statusFilter = status;
    this.loadProperties();
  }

  approve(property: AdminProperty) {
    this.adminService.approveProperty(property.id).subscribe({
      next: () => this.loadProperties(),
      error: () => (this.actionError = `Failed to approve "${property.title}".`),
    });
  }

  reject(property: AdminProperty) {
    if (!confirm(`Reject "${property.title}"? It will be removed from the market.`)) return;

    this.adminService.rejectProperty(property.id).subscribe({
      next: () => this.loadProperties(),
      error: () => (this.actionError = `Failed to reject "${property.title}".`),
    });
  }

  delete(property: AdminProperty) {
    if (!confirm(`Permanently delete "${property.title}"? This cannot be undone.`)) return;

    this.adminService.deleteProperty(property.id).subscribe({
      next: () => this.loadProperties(),
      error: () => (this.actionError = `Failed to delete "${property.title}".`),
    });
  }
}
