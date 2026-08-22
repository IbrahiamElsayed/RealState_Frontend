import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  registerError = '';

  registerForm = this.fb.group(
    {
      userName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (control: AbstractControl): ValidationErrors | null => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password && confirmPassword && password.value !== confirmPassword.value) {
          return { passwordMismatch: true };
        }
        return null;
      },
    },
  );

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registerError = '';

    this.authService.register(this.registerForm.value as any).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 400) {
          const apiErrors = err.error?.errors;
          if (apiErrors) {
            const allMessages: string[] = [];
            for (const field of Object.keys(apiErrors)) {
              const msgs = apiErrors[field];
              for (const msg of msgs) {
                const lower = msg.toLowerCase();
                if (lower.includes('username') || lower.includes('name')) {
                  this.registerForm.get('userName')?.setErrors({ usernameExists: true });
                  allMessages.push(msg);
                } else if (lower.includes('email')) {
                  this.registerForm.get('email')?.setErrors({ emailExists: true });
                  allMessages.push(msg);
                } else if (lower.includes('password')) {
                  this.registerForm.get('password')?.setErrors({ serverError: true });
                  allMessages.push(msg);
                } else {
                  allMessages.push(msg);
                }
              }
            }
            this.registerError = allMessages.join('. ');
          } else {
            this.registerError = err.error?.title || 'Email or username is already taken';
          }
        } else if (err.status === 0) {
          this.registerError = 'Unable to connect to the server. Please check your backend api.';
        } else {
          this.registerError = 'An unexpected error occurred. Please try again.';
        }
      },
    });
  }
}
