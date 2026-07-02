import { Component } from '@angular/core';
import { HeaderComponent } from "../../component/header/header.component";
import { BookingProgressComponent } from "../../component/booking-progress/booking-progress.component";
import { FooterComponent } from "../../component/footer/footer.component";
import { Flight } from '../../models/flight.model';
import { City } from '../../models/city.model';
import { Passenger } from '../../models/passenger.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service';
import { combineLatest, map } from 'rxjs';
import { isValid } from 'date-fns';
import { SearchFlightButtonComponent } from "../../component/search-flight-button/search-flight-button.component";
import { LoaderComponent } from "../../component/loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-ons-page',
  imports: [CommonModule, HeaderComponent, BookingProgressComponent, FooterComponent, SearchFlightButtonComponent, LoaderComponent],
  templateUrl: './add-ons-page.component.html',
  styleUrl: './add-ons-page.component.scss'
})
export class AddOnsPageComponent {
  currentStepIndex = 2;
  
  searchButtonText = "Continue";
  passengers: Passenger[] = []; 
  totalPassengers = 0; 
  loading = true;
  flightType: any;
 
   constructor(
     public route: ActivatedRoute,
     public router: Router,
     private passengerService: PassengerService,
   ) { }

   formatFlightDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
 
   ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Flight Search Parameters:', params);
      this.flightType = params['flightType']
    });

    this.passengerService.currentPassengers.subscribe(p => {
      this.passengers = p;
      this.totalPassengers = this.passengers.length;
      console.log('Passenger Details:', this.passengers);
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
   }
    
  navigateToBooking(event?: Event) {
    event?.preventDefault();

    const currentParams = { ...this.route.snapshot.queryParams };

    this.router.navigate(['/booking'], {
      queryParams: currentParams
    });
  }

  navigateBack(event?: Event) {
    event?.preventDefault();

    const currentParams = { ...this.route.snapshot.queryParams };

    this.router.navigate(['/guest-details'], {
      queryParams: currentParams
    });
  }
}
