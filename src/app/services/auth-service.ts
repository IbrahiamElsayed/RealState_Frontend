import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../models/auth-model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';
  private readonly BASE_API_URL = 'https://localhost:7024';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadStoredUser();
    }
  }

  private loadStoredUser(): void {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (user && token) {
        const parsedUser = JSON.parse(user);
        if (parsedUser) {
          this.currentUserSubject.next(parsedUser);
        }
      } else {
        this.clearStoredData();
      }
    } catch (error) {
      console.error('Error loading stored user data:', error);
      this.clearStoredData();
    }
  }

  private clearStoredData(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  private storeAuthData(response: AuthResponse): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(
        this.USER_KEY,
        JSON.stringify({
          username: response.userName,
          email: response.email,
          roles: response.roles,
        }),
      );
    }
    this.currentUserSubject.next({
      username: response.userName,
      email: response.email,
      roles: response.roles,
    });
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_API_URL}/api/AuthController/Login`, request)
      .pipe(tap((response) => this.storeAuthData(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.BASE_API_URL}/api/AuthController/Register`, request)
      .pipe(tap((response) => this.storeAuthData(response)));
  }

  logout(): void {
    this.clearStoredData();
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getUser(): User | null {
    return this.currentUserSubject.value;
  }

  getRoles(): string[] {
    return this.currentUserSubject.value?.roles || [];
  }

  isBuyer(): boolean {
    return this.getRoles().includes('Buyer');
  }

  isSeller(): boolean {
    return this.getRoles().includes('Seller');
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Admin');
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && this.currentUserSubject.value !== null;
  }
}
