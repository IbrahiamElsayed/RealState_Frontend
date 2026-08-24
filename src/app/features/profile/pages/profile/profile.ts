import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile-service';
import { AuthService } from '../../../../core/services/auth-service';
import { Profile as ProfileModel } from '../../models/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private service = inject(ProfileService);
  private auth = inject(AuthService);
  private router = inject(Router);

  profile: ProfileModel | null = null;
  editForm = {
    fullName: '',
    phoneNumber: '',
    address: '',
    bio: '',
  };

  editMode = false;
  loading = true;
  saving = false;
  deleting = false;
  saved = false;
  error = '';
  deleteError = '';

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = '';
    this.service.getProfile().subscribe({
      next: (res: ProfileModel) => {
        this.profile = res;
        this.populateForm();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to load profile';
        this.loading = false;
      },
    });
  }

  populateForm() {
    if (!this.profile) return;
    this.editForm = {
      fullName: this.profile.fullName || '',
      phoneNumber: this.profile.phoneNumber || '',
      address: this.profile.address || '',
      bio: this.profile.bio || '',
    };
  }

  edit() {
    this.populateForm();
    this.editMode = true;
    this.error = '';
  }

  cancel() {
    this.editMode = false;
    this.error = '';
  }

  save() {
    if (!this.profile) return;

    if (!this.editForm.fullName.trim()) {
      this.error = 'Full name is required';
      return;
    }

    this.saving = true;
    this.error = '';
    this.saved = false;

    const payload = {
      fullName: this.editForm.fullName.trim(),
      phoneNumber: this.editForm.phoneNumber.trim() || null,
      address: this.editForm.address.trim() || null,
      bio: this.editForm.bio.trim() || null,
    };

    this.service.updateProfile(payload).subscribe({
      next: () => {
        this.profile = {
          ...this.profile!,
          fullName: payload.fullName,
          phoneNumber: payload.phoneNumber,
          address: payload.address,
          bio: payload.bio,
        };
        this.service.cached.set(this.profile);
        this.editMode = false;
        this.saving = false;
        this.saved = true;
        setTimeout(() => (this.saved = false), 2500);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Failed to update profile';
        this.saving = false;
      },
    });
  }

  delete() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    this.deleting = true;
    this.deleteError = '';

    this.service.deleteProfile().subscribe({
      next: () => {
        this.auth.logout();
        this.service.clearCache();
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.deleteError = err.error?.message || 'Failed to delete account';
        this.deleting = false;
      },
    });
  }

  getInitial(): string {
    const name = this.profile?.fullName || this.profile?.userName || 'U';
    return name.charAt(0).toUpperCase();
  }

  getRoleBadge(): string {
    return this.profile?.roles?.[0] || 'Buyer';
  }
}
