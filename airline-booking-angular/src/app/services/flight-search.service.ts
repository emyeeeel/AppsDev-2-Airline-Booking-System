// flight-search.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlightSearchService {
  // Subjects with initial null values
  public fromIataSubject = new BehaviorSubject<string | null>(null);
  public toIataSubject = new BehaviorSubject<string | null>(null);

  // Observables
  fromIata$ = this.fromIataSubject.asObservable();
  toIata$ = this.toIataSubject.asObservable();

  setFromIata(iata: string | null): void {
    this.fromIataSubject.next(iata);
  }

  setToIata(iata: string | null): void {
    this.toIataSubject.next(iata);
  }

  // Optional: Helper method to clear both values
  clearSelection() {
    this.fromIataSubject.next(null);
    this.toIataSubject.next(null);
  }
}