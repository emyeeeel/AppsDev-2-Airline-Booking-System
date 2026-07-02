import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Passenger } from '../models/passenger.model';

@Injectable({ providedIn: 'root' })
export class PassengerService {
  // Store passengers data
  private passengersSource = new BehaviorSubject<Passenger[]>([]);
  
  // Observable for components to subscribe to
  currentPassengers = this.passengersSource.asObservable();

  constructor() {
    // Optional: Load passengers from localStorage on service initialization (if needed)
    const storedPassengers = localStorage.getItem('passengers');
    if (storedPassengers) {
      this.passengersSource.next(JSON.parse(storedPassengers));
    }
  }

  // Update passengers list and persist it to localStorage (if needed)
  updatePassengers(passengers: Passenger[]): void {
    const updatedPassengers = passengers.map(p => ({ ...p }));
    this.passengersSource.next(updatedPassengers);
    localStorage.setItem('passengers', JSON.stringify(updatedPassengers)); // Optional: persist to localStorage
  }

  // Set a new list of passengers, can be used to initialize the list
  setPassengers(passengers: Passenger[]): void {
    this.passengersSource.next(passengers);
    localStorage.setItem('passengers', JSON.stringify(passengers)); // Optional: persist to localStorage
  }

  // Get current list of passengers
  getPassengers(): Passenger[] {
    return this.passengersSource.getValue();  // Returns current value of passengers as an array
  }
}
