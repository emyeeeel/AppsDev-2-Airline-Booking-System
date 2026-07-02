import { Component, OnInit } from '@angular/core';
import { Passenger } from '../../models/passenger.model';
import { PassengerService } from '../../services/passenger.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent implements OnInit {
  passengers: Passenger[] = [];
  selectedPassenger?: Passenger;

  constructor(private passengerService: PassengerService) {}

  ngOnInit() {
    this.passengerService.currentPassengers.subscribe(p => {
      this.passengers = p;
    });
  }

  trackPassenger(index: number, passenger: Passenger): string {
    return passenger.id; // Ensure Passenger model has unique ID
  }
}
