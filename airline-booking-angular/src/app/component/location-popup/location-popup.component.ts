import { Component, EventEmitter, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-location-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './location-popup.component.html',
  styleUrl: './location-popup.component.scss'
})
export class LocationPopupComponent {
  @Input() excludedCityId: number | null = null;
  @Output() locationSelected = new EventEmitter<{ 
    displayName: string; 
    iataCode: string | undefined; 
    cityId: number 
  }>();

  countries: Country[] = [];
  isLoading = true;
  expandedCountries = new Set<number>();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Country[]>('http://127.0.0.1:8000/api/countries/').subscribe({
      next: (data) => {
        this.countries = data
          .map(country => ({
            ...country,
            cities: country.cities.sort((a, b) => a.name.localeCompare(b.name))
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
        this.isLoading = false;
      }
    });
  }

  get filteredCountries(): Country[] {
    if (!this.excludedCityId) return this.countries;

    return this.countries
      .map(country => ({
        ...country,
        cities: country.cities.filter(city => city.id !== this.excludedCityId)
      }))
      .filter(country => country.cities.length > 0);
  }

  toggleCountry(countryId: number): void {
    this.expandedCountries.has(countryId) 
      ? this.expandedCountries.delete(countryId) 
      : this.expandedCountries.add(countryId);
  }

  selectCity(city: City): void {
    const displayName = city.airports?.length > 0
      ? `${city.name} (${city.airports[0].IATA_code})`
      : city.name;

    this.locationSelected.emit({
      displayName,
      iataCode: city.airports?.[0]?.IATA_code,
      cityId: city.id
    });
  }

  getAirportCodes(city: City): string {
    return city.airports?.map(a => a.IATA_code).join(', ') || '';
  }
}