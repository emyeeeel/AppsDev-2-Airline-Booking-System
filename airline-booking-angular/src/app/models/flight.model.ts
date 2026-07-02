import { Airport } from "./airport.model";

export interface Flight {
    id: number;
    flight_number: string;
    departure_airport: Airport;
    arrival_airport: Airport;
    departure_time: string;
    arrival_time: string;
    duration: string;
    price: string;
    total_seats: number;
    available_seats: number;
    airline: string;
}