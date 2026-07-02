import { Passenger, PassengerCreate } from "./passenger.model";

// models/booking.model.ts
export interface Booking {
    id: number;
    booking_reference: string;
    total_price: number;
    created_at: string;
  }
  
  export interface BookingCreate {
    departing_flight_id: number;
    returning_flight_id?: number;
    travel_insurance: number;
    passengers: PassengerCreate[]; 
  }
  