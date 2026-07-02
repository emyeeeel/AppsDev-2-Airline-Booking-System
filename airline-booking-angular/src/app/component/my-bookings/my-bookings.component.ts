import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Flight } from '../../models/flight.model';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-my-bookings',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './my-bookings.component.html',
  styleUrl: './my-bookings.component.scss'
})
export class MyBookingsComponent {
  currentUser: any;
  bookings: any[] = [];
  cities: any[] = [];
  loading = true;
  selectedBookingReference: string | null = null;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log(this.currentUser);

    this.fetchAllCities(() => {
      this.fetchBookings(() => {
        this.fetchFlightDetails();
        this.loading = false;
      });
    });
  }

  // Fetch all cities and store them
  private fetchAllCities(callback: () => void): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/cities/').subscribe({
      next: (data) => {
        this.cities = data;
        callback();
      },
      error: (err) => {
        console.error('Error fetching cities:', err);
        callback();
      }
    });
  }

  // Fetch bookings for the current user
  private fetchBookings(callback: () => void): void {
    this.http.get<any[]>('http://127.0.0.1:8000/api/bookings/', {
      headers: { Authorization: `Token ${this.authService.getToken()}` }
    }).subscribe({
      next: (data) => {
        this.bookings = data;
        callback();
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
        callback();
      }
    });
  }

  // Fetch flight details for each booking
  private fetchFlightDetails(): void {
    this.bookings.forEach((booking) => {
      this.fetchFlight(booking.departing_flight_id, (flight) => {
        booking.departing_flight = flight;
        booking.departing_flight.departure_airport.city_name = this.getCityNameByIATACode(flight.departure_airport.IATA_code);
        booking.departing_flight.arrival_airport.city_name = this.getCityNameByIATACode(flight.arrival_airport.IATA_code);
      });

      if (booking.returning_flight_id) {
        this.fetchFlight(booking.returning_flight_id, (flight) => {
          booking.returning_flight = flight;
          booking.returning_flight.departure_airport.city_name = this.getCityNameByIATACode(flight.departure_airport.IATA_code);
          booking.returning_flight.arrival_airport.city_name = this.getCityNameByIATACode(flight.arrival_airport.IATA_code);
        });
      }
    });
  }

  // Fetch a single flight by ID
  private fetchFlight(flightId: number, callback: (flight: Flight) => void): void {
    this.http.get<Flight>(`http://127.0.0.1:8000/api/flights/${flightId}/`).subscribe({
      next: (flight) => callback(flight),
      error: (err) => console.error(`Error fetching flight with ID ${flightId}:`, err)
    });
  }

  // Get city name by IATA code
  private getCityNameByIATACode(IATA_code: string): string {
    const city = this.cities.find((c) => c.code === IATA_code);
    return city ? city.name : 'Unknown City';
  }

  // Toggle the visibility of booking details
  toggleBookingDetails(bookingReference: string): void {
    this.selectedBookingReference = this.selectedBookingReference === bookingReference ? null : bookingReference;
  }

  getPassengerType(type: string): string {
    const passengerTypeMap: { [key: string]: string } = {
      AD: 'Adult',
      CH: 'Children',
      IN: 'Infant'
    };
    return passengerTypeMap[type] || type; // Return the full form or the original type if not found
  }

  getRandomSeat(): string {
    const row = Math.floor(Math.random() * 30) + 1; // Random row between 1 and 30
    const seat = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // Random seat letter (A-F)
    return `${row}${seat}`; // Combine row and seat letter
  }
}
