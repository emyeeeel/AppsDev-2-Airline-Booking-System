import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../component/footer/footer.component';
import { HeaderComponent } from '../../component/header/header.component';
import { BookingProgressComponent } from '../../component/booking-progress/booking-progress.component';
import { FlightDetailsComponent } from '../../component/flight-details/flight-details.component';
import { SearchFlightButtonComponent } from '../../component/search-flight-button/search-flight-button.component';
import { LoaderComponent } from '../../component/loader/loader.component';
import { Flight } from '../../models/flight.model';
import { City } from '../../models/city.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { isValid } from 'date-fns';
import { GuestInfoComponent } from "../../component/guest-info/guest-info.component";
import { ContactInfoComponent } from "../../component/contact-info/contact-info.component";
import { Passenger } from '../../models/passenger.model';
import { PassengerService } from '../../services/passenger.service';

@Component({
  selector: 'app-guest-details-page',
  imports: [CommonModule, HeaderComponent, FooterComponent, BookingProgressComponent, FlightDetailsComponent, SearchFlightButtonComponent, LoaderComponent, GuestInfoComponent, ContactInfoComponent],
  templateUrl: './guest-details-page.component.html',
  styleUrl: './guest-details-page.component.scss'
})
export class GuestDetailsPageComponent implements OnInit {
  searchButtonText = "Continue";
  loading = true;
  currentStepIndex = 1;
  passengers: Passenger[] = [];
  selectedPassenger?: Passenger;
  flightType = 'Round-trip'; 

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private passengerService: PassengerService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Flight Search Parameters:', params);
      this.flightType = params['flightType']
    });
    this.passengerService.currentPassengers.subscribe(p => {
      this.passengers = p;
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  scrollTo(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  navigateToAddOns(event?: Event) {
    event?.preventDefault();

    const currentParams = { ...this.route.snapshot.queryParams };

    this.router.navigate(['/add-ons'], {
      queryParams: currentParams
    });
  }
}
