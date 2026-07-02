import { Component, HostListener, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPopupComponent } from '../location-popup/location-popup.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlightSearchService } from '../../services/flight-search.service';

@Component({
  selector: 'app-destination-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    LocationPopupComponent
  ],
  templateUrl: './destination-picker.component.html',
  styleUrl: './destination-picker.component.scss'
})
export class DestinationPickerComponent {
  selectedFromCityId: number | null = null;
  selectedToCityId: number | null = null;
  selectedFromIata: string | null = null;
  selectedToIata: string | null = null;
  displayFrom = 'Select Origin';
  displayTo = 'Select Destination';
  showFromPopup = false;
  showToPopup = false;

  constructor(private flightSearchService: FlightSearchService) {}

  // Update EventEmitter types to match service expectations
  @Output() fromSelected = new EventEmitter<string | null>();
  @Output() toSelected = new EventEmitter<string | null>();

  handleFromClick(): void {
    this.showFromPopup = !this.showFromPopup;
    this.showToPopup = false;
  }

  handleToClick(): void {
    this.showToPopup = !this.showToPopup;
    this.showFromPopup = false;
  }

  handleLocationSelected(
    event: { displayName: string; iataCode: string | undefined; cityId: number }, 
    type: 'from' | 'to'
  ): void {
    // Convert undefined to null for type consistency
    const iataCode = event.iataCode ?? null;

    if (type === 'from') {
      this.selectedFromCityId = event.cityId;
      this.selectedFromIata = iataCode;
      this.displayFrom = event.displayName;
      this.flightSearchService.setFromIata(iataCode);
      this.fromSelected.emit(iataCode);
    } else {
      this.selectedToCityId = event.cityId;
      this.selectedToIata = iataCode;
      this.displayTo = event.displayName;
      this.flightSearchService.setToIata(iataCode);
      this.toSelected.emit(iataCode);
    }

    this.closePopups();
  }

  // Rest of the component remains the same
  swapLocations(): void {
    [this.selectedFromCityId, this.selectedToCityId] = [this.selectedToCityId, this.selectedFromCityId];
    [this.selectedFromIata, this.selectedToIata] = [this.selectedToIata, this.selectedFromIata];
    [this.displayFrom, this.displayTo] = [this.displayTo, this.displayFrom];
    
    this.flightSearchService.setFromIata(this.selectedFromIata);
    this.flightSearchService.setToIata(this.selectedToIata);
    
    this.closePopups();
  }

  private closePopups(): void {
    this.showFromPopup = false;
    this.showToPopup = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.location-picker-element')) {
      this.closePopups();
    }
  }
}