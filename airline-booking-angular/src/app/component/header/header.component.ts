import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { PopupInfoComponent } from '../popup-info/popup-info.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PopupInfoComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isHoveredByDefault = false;
  isPopupVisible = false;
  currentMenu: string = '';
  private hideTimeout: any;
  userInitials: string = '';
  advisories = [
    { text: 'Travel Reminders' },
    { text: 'Peak Travel Reminders for the Holiday Season' },
    { text: 'Cancelled Flight Due to Eruption of Mt. Kanlaon' }
  ];
  currentAdvisoryIndex = 0;
  user: any;

  private userSubscription!: Subscription;

  constructor(
    private router: Router, 
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.userInitials = this.calculateInitials();
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private calculateInitials(): string {
    if (!this.user) return '';
    const firstNameInitial = this.user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastNameInitial = this.user.lastName?.charAt(0)?.toUpperCase() || '';
    return firstNameInitial + lastNameInitial;
  }

  showPopup(menu: string) {
    clearTimeout(this.hideTimeout);
    this.currentMenu = menu;
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.hideTimeout = setTimeout(() => {
      this.isPopupVisible = false;
    }, 300);
  }

  get currentAdvisory() {
    return this.advisories[this.currentAdvisoryIndex];
  }

  changeAdvisory(direction: number) {
    this.currentAdvisoryIndex += direction;
    
    if (this.currentAdvisoryIndex >= this.advisories.length) {
      this.currentAdvisoryIndex = 0;
    } else if (this.currentAdvisoryIndex < 0) {
      this.currentAdvisoryIndex = this.advisories.length - 1;
    }
  }

  navigateToHome() {
    this.router.navigate(['/landing']);
  }

  refreshUserData() {
    this.user = this.authService.getCurrentUser();
    this.userInitials = this.calculateInitials();
  }
}