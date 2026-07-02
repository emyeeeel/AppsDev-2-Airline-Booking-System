import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../component/header/header.component';
import { CommonModule, DecimalPipe, formatDate } from '@angular/common';
import { BookingProgressComponent } from '../../component/booking-progress/booking-progress.component';
import { SearchFlightButtonComponent } from "../../component/search-flight-button/search-flight-button.component";
import { ActivatedRoute, Router } from '@angular/router';
import { PassengerService } from '../../services/passenger.service'; 
import { Passenger } from '../../models/passenger.model'; 

@Component({
  selector: 'app-confirmation-page',
  imports: [HeaderComponent, BookingProgressComponent, CommonModule, SearchFlightButtonComponent],
  templateUrl: './confirmation-page.component.html',
  styleUrl: './confirmation-page.component.scss'
})
export class ConfirmationPageComponent implements OnInit {
  currentStepIndex = 4;
  searchButtonText = "View Itinerary";
  currentDate = formatDate(new Date(), 'dd MMMM yyyy', 'en-US');
  passengers: Passenger[] = []; 
  totalPassengers = 0; 

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private passengerService: PassengerService 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Flight Search Parameters:', params);
    });

    this.passengerService.currentPassengers.subscribe(p => {
      this.passengers = p;
      this.totalPassengers = this.passengers.length;
      console.log('Passenger Details:', this.passengers);
    });
  }

  navigateToMyBookings() {
    console.log('Navigating to My Bookings...');
    this.router.navigate(['/my-bookings']);
  }
}