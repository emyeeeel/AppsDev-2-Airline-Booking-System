// guest-info.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Flight } from '../../models/flight.model';
import { City } from '../../models/city.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { isValid } from 'date-fns';
import { Passenger } from '../../models/passenger.model';
import { PassengerService } from '../../services/passenger.service';

@Component({
  selector: 'app-guest-info',
  imports: [CommonModule, FormsModule], 
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss']
})
export class GuestInfoComponent implements OnInit {
  searchButtonText = "Continue";
  flights: Flight[] = [];
  departingFlights: Flight[] = [];
  returningFlights: Flight[] = [];
  cities = new Map<number, City>();
  departureCityName = 'Loading...';
  arrivalCityName = 'Loading...';
  loading = true;
  error: string | null = null;
  selectedDepartDate?: Date;
  selectedReturnDate?: Date;
  selectedDepartingFlight: Flight | null = null;
  selectedReturningFlight: Flight | null = null;
  currentStepIndex = 1;
  flightType = 'Round-trip'; 
  isButtonEnabled = true;

  adults = 0;
  children = 0;
  infants = 0;
  totalPassengers = 0;

  passengers: Passenger[] = [];

  setActivePassenger(index: number): void {
    this.passengers.forEach((p, i) => p.isActive = i === index);
  }

  days = Array.from({length: 31}, (_, i) => i + 1);
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];

  private apiBase = 'http://127.0.0.1:8000/api/';

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 100}, (_, i) => currentYear - i);
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private passengerService: PassengerService
  ) { }

  getPassengerNumber(type: 'Adult' | 'Child' | 'Infant', index: number): number {
    if (type === 'Adult') {
      return index + 1;
    } else if (type === 'Child') {
      return index - this.adults + 1;
    } else {
      return index - this.adults - this.children + 1;
    }
  }

  onDepartingFlightSelect(flight: Flight): void {
    this.selectedDepartingFlight = 
      this.selectedDepartingFlight === flight ? null : flight;
  }
  
  onReturningFlightSelect(flight: Flight): void {
    this.selectedReturningFlight = 
      this.selectedReturningFlight === flight ? null : flight;
  }

  ngOnInit(): void {
    this.loadData();
    this.initializeYears();
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

  countries = [
    'Philippines',
    'Australia',
    'Japan',
    'Singapore',
    'United States',
    // Add more countries as needed
  ];

  nextPassenger(): void {
    const currentIndex = this.passengers.findIndex(p => p.isActive);
    if (currentIndex !== -1 && currentIndex < this.passengers.length - 1) {
      this.setActivePassenger(currentIndex + 1);
      this.scrollTo('guest-details'); // Optional smooth scroll to top
    }
  }

  get currentPassengerIndex(): number {
    return this.passengers.findIndex(p => p.isActive);
  }
  

  private loadData(): void {
    const cities$ = this.http.get<City[]>(`${this.apiBase}cities/`);
    const flights$ = this.http.get<Flight[]>(`${this.apiBase}flights/`);
    const params$ = this.route.queryParams;

    combineLatest([cities$, flights$, params$]).pipe(
      map(([cities, flights, params]) => {
        this.flightType = params['flightType'] || 'Round-trip';
        if (!this.validateParameters(params)) {
          throw new Error('Invalid parameters');
        }

        this.cities.clear();
        cities.forEach(city => this.cities.set(city.id, city));
        
        if (params['departDate']) {
          this.selectedDepartDate = new Date(params['departDate']);
        }
        if (params['returnDate']) {
          this.selectedReturnDate = new Date(params['returnDate']);
        }
        
        return { flights, params };
      })
    ).subscribe({
      next: ({ flights, params }) => {
        this.adults = Number(params['adults']) || 0;
        this.children = Number(params['children']) || 0;
        this.infants = Number(params['infants']) || 0;
        this.totalPassengers = this.adults + this.children + this.infants;
        this.flights = flights;
        this.departingFlights = this.applyFilters(params['departure'], params['arrival']);
        this.returningFlights = this.applyFilters(params['arrival'], params['departure']);
        this.setCityNames();
        this.loading = false;
        this.initializePassengers();
      },
      error: (err) => {
        this.error = 'Failed to load flight data. Please try again later.';
        this.loading = false;
        console.error('API Error:', err);
        this.router.navigate(['/']);
      }
    });
  }

  private validateParameters(params: any): boolean {
    const requiredParams = ['departure', 'arrival', 'departDate'];
    const flightType = params['flightType'] || 'Round-trip';
  
    if (flightType === 'Round-trip') {
      requiredParams.push('returnDate');
    }
  
    if (!requiredParams.every(p => params[p])) {
      return false;
    }
  
    // Passenger validation
    const adults = Number(params['adults']) || 0;
    const children = Number(params['children']) || 0;
    const infants = Number(params['infants']) || 0;
    const total = adults + children + infants;
  
    if (
      adults < 0 || 
      children < 0 || 
      infants < 0 ||
      total < 1
    ) {
      return false;
    }
  
    // Date validation
    const departDate = new Date(params['departDate']);
    if (!isValid(departDate)) return false;
  
    if (flightType === 'Round-trip') {
      const returnDate = new Date(params['returnDate']);
      if (!isValid(returnDate)) return false;
    }
  
    return true;
  }

  private applyFilters(departureIata?: string, arrivalIata?: string): Flight[] {
    return this.flights.filter(flight => {
      const matchesDeparture = !departureIata || 
        flight.departure_airport.IATA_code === departureIata;
      const matchesArrival = !arrivalIata || 
        flight.arrival_airport.IATA_code === arrivalIata;
      return matchesDeparture && matchesArrival;
    });
  }

  private setCityNames(): void {
    if (this.departingFlights.length > 0) {
      const firstFlight = this.departingFlights[0];
      const depCity = this.cities.get(firstFlight.departure_airport.city);
      this.departureCityName = depCity?.name || 'Unknown City';
      const arrCity = this.cities.get(firstFlight.arrival_airport.city);
      this.arrivalCityName = arrCity?.name || 'Unknown City';
    }
  }

  private initializePassengers(): void {
    this.passengers = [];
    
    // Add adults
    for (let i = 0; i < this.adults; i++) {
      this.passengers.push({
        id: `adult-${i}`,
        type: 'Adult',
        isActive: i === 0,
        name: {
          title: '',
          firstName: '',
          lastName: '',
          hasNoFirstName: false
        },
        dateOfBirth: {
          day: '',
          month: '',
          year: ''
        },
        nationality: '',
        goRewardsId: '',
        selectedDepartingFlight: this.selectedDepartingFlight || undefined,
        selectedReturningFlight: this.selectedReturningFlight || undefined,
        hasDeclaration: false,
        isPWD: false
      });
    }
  
    // Add children
    for (let i = 0; i < this.children; i++) {
      this.passengers.push({
        id: `child-${i}`,
        type: 'Child',
        isActive: false,
        name: {
          title: '',
          firstName: '',
          lastName: '',
          hasNoFirstName: false
        },
        dateOfBirth: {
          day: '',
          month: '',
          year: ''
        },
        nationality: '',
        selectedDepartingFlight: this.selectedDepartingFlight || undefined,
        selectedReturningFlight: this.selectedReturningFlight ?? undefined,
        hasDeclaration: false,
        isPWD: false
      });
    }
  
    if (this.passengers.length > 0 && !this.passengers.some(p => p.isActive)) {
      this.passengers[0].isActive = true;
    }

    console.log('Initial passengers:', this.passengers);
    this.passengerService.updatePassengers(this.passengers);
  }

  onPassengerUpdate() {
    console.log('Updated passengers:', this.passengers);
    this.passengerService.updatePassengers(this.passengers);
  }

  
}