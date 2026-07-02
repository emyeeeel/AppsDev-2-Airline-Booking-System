// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserKey = 'currentUser';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    // Initialize with current user from storage
    this.userSubject.next(this.getCurrentUser());
  }

  setCurrentUser(userData: any): void {
    localStorage.setItem(this.currentUserKey, JSON.stringify(userData));
    this.userSubject.next(userData);
  }

  getToken(): string | null {
    const userData = this.getCurrentUser();
    return userData?.token || null;
  }

  getCurrentUser(): any {
    const userData = localStorage.getItem(this.currentUserKey);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value?.token;
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.userSubject.next(null);
    this.router.navigate(['/landing']);
  }
}