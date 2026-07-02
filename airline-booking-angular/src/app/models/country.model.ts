import { City } from "./city.model";

export interface Country {
    id: number;
    name: string;
    code: string;
    cities: City[];
 }
  