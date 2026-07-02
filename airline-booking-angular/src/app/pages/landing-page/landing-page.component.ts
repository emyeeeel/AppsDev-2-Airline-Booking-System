import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../component/header/header.component';
import { DatePickerComponent } from '../../component//date-picker/date-picker.component';
import { SearchFlightButtonComponent } from '../../component//search-flight-button/search-flight-button.component';
import { DestinationPickerComponent } from '../../component/destination-picker/destination-picker.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlightSearchService } from '../../services/flight-search.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeFooterComponent } from '../../component/home-footer/home-footer.component';
import { SnsStoriesComponent } from '../../component/sns-stories/sns-stories.component';
import { AdvertisementComponent } from '../../component/advertisement/advertisement.component';
import { CheapFlightsComponent } from '../../component/cheap-flights/cheap-flights.component';
import { SearchFlightPopupComponent } from '../../component/search-flight-popup/search-flight-popup.component';
import { LatestStoriesComponent } from '../../component/latest-stories/latest-stories.component';

@Component({
  selector: 'app-landing-page',
  imports: [RouterOutlet, HeaderComponent, LatestStoriesComponent, SearchFlightPopupComponent, CheapFlightsComponent, DestinationPickerComponent, DatePickerComponent, SearchFlightButtonComponent, CommonModule, FormsModule, HomeFooterComponent, SnsStoriesComponent, AdvertisementComponent], 
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  searchButtonText = "Search Flights";
  seeMoreText = "See more";
  user: any;
  private userSubscription!: Subscription;
  selectedFlightType = 'Round-trip';
  showSearchPopup = false;
  

  @ViewChild(DatePickerComponent) datePicker!: DatePickerComponent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flightSearchService: FlightSearchService
  ) {}

  ngOnInit() {
    this.startCarousel();
    this.preloadImages();
    
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.clearCarousel();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Background Carousel Data
  backgrounds = [
    { 
      image: 'https://cdn.media.amplience.net/i/cebupacificair/SIN-Singapore-MarinaBay1-5472x3648?fmt=auto&maxW=1920&maxH=1920&w=1920&qlt=60&fmt.options=interlaced',
      location: 'SINGAPORE'
    },
    { 
      image: 'https://cdn.media.amplience.net/i/cebupacificair/Islas%20de%20Gigates%20Iloilo_LJ%20(1)?fmt=auto&maxW=1920&maxH=1920&w=1920&qlt=60&fmt.options=interlaced',
      location: 'ILOILO'
    },
    { 
      image: 'https://cdn.media.amplience.net/i/cebupacificair/DVO-Davao-Philippines-Mountains-6000x3375?fmt=auto&maxW=1920&maxH=1920&w=1920&qlt=60&fmt.options=interlaced',
      location: 'DAVAO'
    }
  ];


  currentBackgroundIndex = 0;
  private intervalId: any;

  get currentBackground() {
    return this.backgrounds[this.currentBackgroundIndex];
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.changeBackground(1);
    }, 5000);
  }

  clearCarousel() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  changeBackground(direction: number) {
    this.currentBackgroundIndex += direction;
    
    if (this.currentBackgroundIndex >= this.backgrounds.length) {
      this.currentBackgroundIndex = 0;
    } else if (this.currentBackgroundIndex < 0) {
      this.currentBackgroundIndex = this.backgrounds.length - 1;
    }
  }

  private preloadImages() {
    this.backgrounds.forEach(bg => {
      new Image().src = bg.image;
    });
  }

  onSearchClick() {

    this.showSearchPopup = true;
  }

  popup(){
    this.router.navigate(['/test']);
  }
}
