import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SearchFlightButtonComponent } from '../search-flight-button/search-flight-button.component';
import { FlightSearchService } from '../../services/flight-search.service';
import { Router } from '@angular/router';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { DestinationPickerComponent } from '../destination-picker/destination-picker.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-search-flight-popup',
  imports: [SearchFlightButtonComponent, DatePickerComponent, DestinationPickerComponent, FormsModule, CommonModule],
  templateUrl: './search-flight-popup.component.html',
  styleUrl: './search-flight-popup.component.scss'
})
export class SearchFlightPopupComponent {
  @Input() buttonText = 'Search flights';
  @ViewChild(DatePickerComponent) datePicker!: DatePickerComponent;
  selectedFlightType = 'Round-trip';
  
  adultCount = 0;
  childCount = 0;
  infantCount = 0;

  @Output() close = new EventEmitter<void>();

  constructor(
    private flightSearchService: FlightSearchService,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  get totalPassengers(): number {
    return this.adultCount + this.childCount + this.infantCount;
  }

  get isPassengerExceeded(): boolean {
    return this.totalPassengers > 20;
  }

  onClose() {
    this.close.emit();
  }

  onSearchClick() {
    const fromIata = this.flightSearchService.fromIataSubject.value;
    const toIata = this.flightSearchService.toIataSubject.value;
    const isRoundTrip = this.selectedFlightType === 'Round-trip';

    if (!fromIata || !toIata) {
      alert('Please select both departure and arrival locations');
      return;
    }

    if (!this.datePicker.selectedDepartDate) {
      alert('Please select a departure date');
      return;
    }

    if (isRoundTrip && !this.datePicker.selectedReturnDate) {
      alert('Please select a return date for round-trip flights');
      return;
    }

    if (this.totalPassengers > 20) {
      alert('Total passengers cannot exceed 20. Please adjust your selections.');
      return;
    }

    if (this.totalPassengers < 1) {
      alert('At least one passenger is required');
      return;
    }

    const queryParams: any = {
      departure: fromIata,
      arrival: toIata,
      departDate: this.datePicker.selectedDepartDate.toISOString(),
      flightType: this.selectedFlightType,
      adults: this.adultCount,
      children: this.childCount,
      infants: this.infantCount
    };

    if (isRoundTrip && this.datePicker.selectedReturnDate) {
      queryParams.returnDate = this.datePicker.selectedReturnDate.toISOString();
    }

    
    this.router.navigate(['/flights'], { queryParams });
  }
}