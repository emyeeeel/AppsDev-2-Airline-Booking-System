import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../component/header/header.component";
import { CommonModule, DecimalPipe } from '@angular/common';
import { BookingProgressComponent } from "../../component/booking-progress/booking-progress.component";
import { Passenger, PassengerCreate } from '../../models/passenger.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service';
import { LoaderComponent } from "../../component/loader/loader.component";
import { BookingService } from '../../services/booking.service';
import { BookingCreate } from '../../models/booking.model';
import { SearchFlightButtonComponent } from "../../component/search-flight-button/search-flight-button.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-summary-page',
  imports: [HeaderComponent, DecimalPipe, BookingProgressComponent, CommonModule, LoaderComponent, SearchFlightButtonComponent],
  templateUrl: './booking-summary-page.component.html',
  styleUrl: './booking-summary-page.component.scss'
})
export class BookingSummaryPageComponent implements OnInit {
  travel_insurance: number = 1155.00
  currentStepIndex = 3;
  
  searchButtonText = "Continue";
  passengers: Passenger[] = []; 
  totalPassengers = 0; 
  loading = true;
  flightType: any;
  token: any;
 
   constructor(
     private authService: AuthService,
     public route: ActivatedRoute,
     public router: Router,
     private passengerService: PassengerService,
     private bookingService: BookingService
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
    this.token = this.authService.getCurrentUser();
    console.log(this.token['token']);
    setTimeout(() => {
      this.loading = false;
    }, 2000);
   }

   navigateBack(event?: Event) {
    event?.preventDefault();

    const currentParams = { ...this.route.snapshot.queryParams };

    this.router.navigate(['/add-ons'], {
      queryParams: currentParams
    });
  }

  navigateToConfirmation(event?: Event) {
    event?.preventDefault();
  
    // Get flight IDs from query parameters
    const params = this.route.snapshot.queryParams;
    const departingFlightId = Number(params['departFlightID']);
    const returningFlightId = params['returnFlightID'] ? Number(params['returnFlightID']) : undefined;
  
    if (!departingFlightId) {
      console.error('Departing flight ID is required');
      return;
    }
  
    // Transform passengers to match API's PassengerCreate
    const passengersData: PassengerCreate[] = this.passengers.map(passenger => {
      const month = passenger.dateOfBirth.month.padStart(2, '0');
      const day = passenger.dateOfBirth.day.padStart(2, '0');
      
      return {
        title: passenger.name.title,
        first_name: passenger.name.hasNoFirstName ? '' : passenger.name.firstName,
        last_name: passenger.name.lastName,
        date_of_birth: `${passenger.dateOfBirth.year}-${month}-${day}`,
        nationality: passenger.nationality,
        passenger_type: this.mapPassengerType(passenger.type),
        is_pwd: passenger.isPWD,
        go_rewards_id: passenger.goRewardsId || ''
      };
    });
  
    // Prepare booking data
    const bookingCreate: BookingCreate = {
      departing_flight_id: departingFlightId,
      returning_flight_id: returningFlightId,
      travel_insurance: this.travel_insurance,
      passengers: passengersData
    };
  
    // Submit booking
    this.bookingService.createBooking(bookingCreate).subscribe({
      next: (booking) => {
        this.router.navigate(['/confirmation'], { 
          queryParams: { 
            booking_reference: booking.booking_reference,
            ...this.route.snapshot.queryParams 
          }
        });
      },
      error: (error) => {
        console.error('Booking creation failed:', error);
      }
    });
  }
  
  // Helper remains the same
  private mapPassengerType(type: 'Adult' | 'Child' | 'Infant'): string {
    switch (type) {
      case 'Adult': return 'AD';
      case 'Child': return 'CH';
      case 'Infant': return 'IN';
      default: return 'AD';
    }
  }
    
   calculateTotalCost(): number {
    const params = this.route.snapshot.queryParams;
  
    const departPrice = Number(params['departPrice']) || 0;
    const returnPrice = Number(params['returnPrice']) || 0;
    const adults = Number(params['adults']) || 0;
    const children = Number(params['children']) || 0;
    const infants = Number(params['infants']) || 0;
    const totalPassengers = adults + children + infants;
  
    const departCost = departPrice * totalPassengers;
    let returnCost = 0;
  
    if (params['flightType'] === 'Round-trip') {
      returnCost = returnPrice * totalPassengers;
    }
  
    const totalCost = departCost + returnCost + this.travel_insurance;
    return totalCost;
  }
  
}
