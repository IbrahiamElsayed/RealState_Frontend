import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AdminService,
  AdminCity,
  AdminPropertyType,
} from '../../services/admin-service';

interface EditState {
  id: number;
  name: string;
  country: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
})
export class AdminSettings implements OnInit {
  adminService = inject(AdminService);

  cities: AdminCity[] = [];
  types: AdminPropertyType[] = [];
  loading = true;

  newCityName = '';
  newCityCountry = '';
  newTypeName = '';

  editingCity: EditState | null = null;
  editingType: EditState | null = null;

  toast: string | null = null;
  toastKind: 'success' | 'error' = 'success';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  busy = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.adminService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities || [];
        this.adminService.getPropertyTypes().subscribe({
          next: (types) => {
            this.types = types || [];
            this.loading = false;
          },
          error: () => (this.loading = false),
        });
      },
      error: () => (this.loading = false),
    });
  }

  showToast(message: string, kind: 'success' | 'error'): void {
    this.toast = message;
    this.toastKind = kind;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = null), 3500);
  }

  createCity(): void {
    if (!this.newCityName.trim() || this.busy) return;
    this.busy = true;
    this.adminService.createCity(this.newCityName, this.newCityCountry).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.newCityName = '';
        this.newCityCountry = '';
        this.refreshCities();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to create city.', 'error'),
    });
  }

  startEditCity(city: AdminCity): void {
    this.editingType = null;
    this.editingCity = { id: city.id, name: city.name, country: city.country || '' };
  }

  saveCity(): void {
    const edit = this.editingCity;
    if (!edit || !edit.name.trim() || this.busy) return;
    this.busy = true;
    this.adminService.updateCity(edit.id, edit.name, edit.country).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.editingCity = null;
        this.refreshCities();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to update city.', 'error'),
    });
  }

  deleteCity(city: AdminCity): void {
    if (
      !confirm(
        `Delete city "${city.name}"? This cannot be undone.`,
      )
    )
      return;
    this.adminService.deleteCity(city.id).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.refreshCities();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to delete city.', 'error'),
    });
  }

  createType(): void {
    if (!this.newTypeName.trim() || this.busy) return;
    this.busy = true;
    this.adminService.createPropertyType(this.newTypeName).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.newTypeName = '';
        this.refreshTypes();
      },
      error: (err) =>
        this.showToast(err.error?.message || 'Failed to create property type.', 'error'),
    });
  }

  startEditType(type: AdminPropertyType): void {
    this.editingCity = null;
    this.editingType = { id: type.id, name: type.name, country: '' };
  }

  saveType(): void {
    const edit = this.editingType;
    if (!edit || !edit.name.trim() || this.busy) return;
    this.busy = true;
    this.adminService.updatePropertyType(edit.id, edit.name).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.editingType = null;
        this.refreshTypes();
      },
      error: (err) =>
        this.showToast(err.error?.message || 'Failed to update property type.', 'error'),
    });
  }

  deleteType(type: AdminPropertyType): void {
    if (
      !confirm(
        `Delete property type "${type.name}"? This cannot be undone.`,
      )
    )
      return;
    this.adminService.deletePropertyType(type.id).subscribe({
      next: (res) => {
        this.showToast(res.message, 'success');
        this.refreshTypes();
      },
      error: (err) =>
        this.showToast(err.error?.message || 'Failed to delete property type.', 'error'),
    });
  }

  private refreshCities(): void {
    this.busy = false;
    this.adminService.getCities().subscribe((cities) => (this.cities = cities || []));
  }

  private refreshTypes(): void {
    this.busy = false;
    this.adminService
      .getPropertyTypes()
      .subscribe((types) => (this.types = types || []));
  }
}
