import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { ProfileService } from '../../core/services/profile-service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  mobileOpen = false;
  userImage: string | null = null;

  constructor(
    public auth: AuthService,
    private router: Router,
    private profileService: ProfileService,
  ) {}

  ngOnInit() {
    const cached = this.profileService.cached();
    if (cached) {
      this.userImage = cached.profileImage || cached.image || cached.imageUrl || null;
    }
    if (this.auth.isLoggedIn()) {
      this.profileService.getProfile().subscribe({
        next: (res: any) => {
          this.userImage = res?.profileImage || res?.image || res?.imageUrl || null;
        },
      });
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}
