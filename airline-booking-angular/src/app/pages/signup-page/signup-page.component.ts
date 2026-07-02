import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule and CommonModule
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent implements OnInit {
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient // Add HttpClient
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/landing']);
    }
  }

  submitSignup() {
    if (!this.email || !this.firstName || !this.lastName || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/register/', {
      email: this.email,
      first_name: this.firstName,
      last_name: this.lastName,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.message = "User registered successfully") {
          console.log("Successful registration")
          // Optional: Auto-login after registration
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Registration error details:', error.error["non_field_errors"]);
        this.errorMessage = error.error?.message || error.error?.detail || error.error["non_field_errors"];
      }
    });
  }

  navigateToHome() {
    this.router.navigate(['/landing']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}