import { Component } from '@angular/core';
import { Flight } from '../../models/flight.model';
import { City } from '../../models/city.model';
import { combineLatest, map } from 'rxjs';
import { isValid } from 'date-fns';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-details',
  imports: [CommonModule],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.scss'
})
export class FlightDetailsComponent {
  flightType = 'Round-trip';
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

  adults = 0;
  children = 0;
  infants = 0;
  totalPassengers = 0;

  private apiBase = 'http://127.0.0.1:8000/api/';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  get passengerSummary(): string {
    const parts = [];
    if (this.adults) parts.push(`${this.adults} Adult${this.adults > 1 ? 's' : ''}`);
    if (this.children) parts.push(`${this.children} Child${this.children > 1 ? 'ren' : ''}`);
    if (this.infants) parts.push(`${this.infants} Infant${this.infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    combineLatest([
      this.http.get<City[]>(`${this.apiBase}cities/`),
      this.http.get<Flight[]>(`${this.apiBase}flights/`),
      this.route.queryParams
    ]).pipe(map(([cities, flights, params]) => {
      this.adults = Number(params['adults']) || 0;
      this.children = Number(params['children']) || 0;
      this.infants = Number(params['infants']) || 0;
      this.totalPassengers = this.adults + this.children + this.infants;
      this.flightType = params['flightType'] || 'Round-trip';

      if (!this.validateParameters(params)) throw new Error('Invalid parameters');

      this.cities.clear();
      cities.forEach(city => this.cities.set(city.id, city));
      
      this.selectedDepartDate = params['departDate'] ? new Date(params['departDate']) : undefined;
      this.selectedReturnDate = params['returnDate'] ? new Date(params['returnDate']) : undefined;

      return { flights, params };
    })).subscribe({
      next: ({ flights, params }) => this.handleDataSuccess(flights, params),
      error: (err) => this.handleDataError(err)
    });
  }

  private handleDataSuccess(flights: Flight[], params: any): void {
    this.flights = flights;
    this.departingFlights = this.filterFlights(params['departure'], params['arrival']);
    this.returningFlights = this.filterFlights(params['arrival'], params['departure']);
    this.setCityNames();
    this.loading = false;
  }

  private handleDataError(err: any): void {
    this.error = 'Failed to load flight data. Please try again later.';
    this.loading = false;
    console.error('API Error:', err);
    this.router.navigate(['/']);
  }

  private validateParameters(params: any): boolean {
    const requiredParams = ['departure', 'arrival', 'departDate'];
    if (this.flightType === 'Round-trip') requiredParams.push('returnDate');
    if (!requiredParams.every(p => params[p])) return false;

    const departDate = new Date(params['departDate']);
    if (!isValid(departDate)) return false;

    if (this.flightType === 'Round-trip') {
      const returnDate = new Date(params['returnDate']);
      if (!isValid(returnDate)) return false;
    }

    return this.totalPassengers > 0;
  }

  private filterFlights(departureIata: string, arrivalIata: string): Flight[] {
    return this.flights.filter(flight => 
      flight.departure_airport.IATA_code === departureIata && 
      flight.arrival_airport.IATA_code === arrivalIata
    );
  }

  private setCityNames(): void {
    if (!this.departingFlights.length) return;

    const firstFlight = this.departingFlights[0];
    this.departureCityName = this.cities.get(firstFlight.departure_airport.city)?.name || 'Unknown City';
    this.arrivalCityName = this.cities.get(firstFlight.arrival_airport.city)?.name || 'Unknown City';
  }

  formatDuration(duration: string): string {
    if (/^\d+$/.test(duration)) {
      const totalMinutes = parseInt(duration, 10);
      return `${Math.floor(totalMinutes/60)}h ${(totalMinutes%60).toString().padStart(2, '0')}m`;
    }

    if (duration.startsWith('PT')) {
      const [h, m] = [duration.match(/(\d+)H/)?.[1] || 0, duration.match(/(\d+)M/)?.[1] || '00'];
      return `${h}h ${m.padStart(2, '0')}m`;
    }

    const [h, m] = duration.split(':');
    return `${h}h ${m.padStart(2, '0')}m`;
  }

  onDepartingFlightSelect(flight: Flight): void {
    this.selectedDepartingFlight = this.selectedDepartingFlight === flight ? null : flight;
  }

  onReturningFlightSelect(flight: Flight): void {
    this.selectedReturningFlight = this.selectedReturningFlight === flight ? null : flight;
  }

  navigateToBookingSummary(event?: Event): void {
    event?.preventDefault();
    this.router.navigate(['/booking']);
  }
}