import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

enum LoginStep {
  Email,
  SecurityMethod,
  PasswordInput
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/landing']);
    }
  }

  LoginStep = LoginStep;
  currentStep: LoginStep = LoginStep.Email;
  email = '';
  password = '';

  navigateToHome() {
    this.router.navigate(['/landing']);
  }

  proceedToPassword() {
    if (this.email) {
      this.currentStep = LoginStep.SecurityMethod;
    }
  }

  goBackToEmail() {
    this.currentStep = LoginStep.Email;
  }

  goBackToPasswordStep() {
    this.currentStep = LoginStep.SecurityMethod;
  }

  selectPasswordMethod() {
    this.currentStep = LoginStep.PasswordInput;
  }

  errorMessage: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {} 

  submitLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
  
    this.http.post('http://127.0.0.1:8000/api/login/', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        if (response.token) { 
          console.log("Successful login");
          this.authService.setCurrentUser({
            token: response.token,
            email: response.email,
            firstName: response.first_name,
            lastName: response.last_name
          });
          this.router.navigate(['/landing']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  //check is there is a user currently logged in, if there is then redirect to /landing
}