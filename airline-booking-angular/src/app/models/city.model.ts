import { Airport } from "./airport.model";

  export interface City {
    id: number;
    name: string;
    code: string,
    country: number; 
    airports: Airport[];
  }