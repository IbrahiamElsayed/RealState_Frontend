import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../../core/services/profile-service';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private service = inject(ProfileService);
  auth = inject(AuthService);

  profile: any = null;
  editMode = false;
  loading = true;
  saved = false;

  ngOnInit() {
    const user = this.auth.getUser();
    const base = {
      userName: user?.username || '',
      username: user?.username || '',
      email: user?.email || '',
      fullName: user?.username || '',
    };

    const cached = this.service.cached();
    if (cached) {
      this.profile = { ...base, ...cached };
      this.loading = false;
      this.refresh();
    } else {
      this.profile = base;
      this.load();
    }
  }

  load() {
    this.loading = true;
    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = { ...this.profile, ...res };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  refresh() {
    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = { ...this.profile, ...res };
      },
      error: () => {},
    });
  }

  edit() {
    this.editMode = true;
  }

  save() {
    if (!this.profile) return;
    this.loading = true;
    this.saved = false;
    this.service.updateProfile(this.profile).subscribe({
      next: () => {
        this.editMode = false;
        this.loading = false;
        this.saved = true;
        setTimeout(() => (this.saved = false), 2500);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  delete() {
    if (confirm('Delete account?')) {
      this.service.deleteProfile().subscribe({
        next: () => {
          localStorage.clear();
          window.location.href = '/login';
        },
        error: () => {},
      });
    }
  }
}
