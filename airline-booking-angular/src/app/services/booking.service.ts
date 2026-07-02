// services/booking.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, BookingCreate } from '../models/booking.model';
import { AuthService } from './auth.service'; // Add this import

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://127.0.0.1:8000/api/bookings/';

  constructor(
    private http: HttpClient,
    private authService: AuthService 
  ) { }

  createBooking(bookingData: BookingCreate): Observable<Booking> {
    const token = this.authService.getCurrentUser()?.token;
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    console.log(bookingData);
    return this.http.post<Booking>(this.apiUrl, bookingData, { headers });
  }
}