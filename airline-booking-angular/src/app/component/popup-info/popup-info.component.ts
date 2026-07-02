import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-popup-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-info.component.html',
  styleUrl: './popup-info.component.scss'
})
export class PopupInfoComponent {
  user: any;
    
  constructor(
      private router: Router, 
      public authService: AuthService // Changed to public to access in template
  ) {
      this.user = this.authService.getCurrentUser();
  }

  // Add logout method
  logout() {
      this.authService.logout();
      this.router.navigate(['/landing']); // Or redirect to home page
  }

  @Input() currentMenu: string = '';
  
  navigateToLogin() {
      this.router.navigate(['/login']);
  }

  navigateToMyBookings() {
    console.log('Navigating to My Bookings...');
    this.router.navigate(['/my-bookings']);
  }
}