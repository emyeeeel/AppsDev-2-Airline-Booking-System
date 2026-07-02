import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() flightType = 'Round-trip';
  selectedDepartDate: Date | null = null;
  selectedReturnDate: Date | null = null;
  minDate!: Date;
  isLoading = true;

  ngOnInit(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = today;
    this.selectedDepartDate = new Date();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flightType'] && this.flightType === 'One-way') {
      this.selectedReturnDate = null;
    }
  }

  onReturnDateSelected(event: any): void {
    this.selectedReturnDate = event.value;
  }
}