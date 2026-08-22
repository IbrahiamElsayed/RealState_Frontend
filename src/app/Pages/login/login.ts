import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  isLoading = false;
  loginError = '';

  loginForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.loginError = '';

    this.authService.login(this.loginForm.value as any).subscribe({
      next: (response) => {
        if (this.authService.isSeller()) {
          this.router.navigate(['/seller/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400 || error.status === 401) {
          const apiErrors = error.error?.errors;
          if (apiErrors) {
            const allMessages: string[] = [];
            for (const field of Object.keys(apiErrors)) {
              allMessages.push(...apiErrors[field]);
            }
            this.loginError = allMessages.join('. ');
          } else {
            this.loginError = error.error?.message || 'Invalid email or password';
          }
        } else if (error.status === 0) {
          this.loginError = 'Unable to connect to the server. Please check your backend api.';
        } else {
          this.loginError = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
}
