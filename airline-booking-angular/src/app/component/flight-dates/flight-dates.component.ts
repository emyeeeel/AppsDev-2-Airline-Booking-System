import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-flight-dates',
  imports: [ CommonModule],
  templateUrl: './flight-dates.component.html',
  styleUrls: ['./flight-dates.component.scss'],
})
export class FlightDatesComponent {
  weekDates: { dateStr: string; price: number; isToday: boolean; date: Date }[] = [];
  currentStartDate!: Date;

  @ViewChildren('flightCard') flightCards!: QueryList<ElementRef>;

  constructor() {
    this.initializeDates();
  }

  ngAfterViewInit() {
    // Optional: scroll today into view
    // setTimeout(() => this.scrollToToday(), 0);
  }

  initializeDates() {
    const today = new Date();
    this.currentStartDate = new Date(today);
    this.currentStartDate.setDate(today.getDate() - 3); // To center today

    this.generateWeekDates();
  }

  generateWeekDates() {
    this.weekDates = [];

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentStartDate);
      date.setDate(this.currentStartDate.getDate() + i);

      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });

      const dateStr = `${day} ${dayNum < 10 ? '0' + dayNum : dayNum} ${month}`;
      const isToday = this.isSameDate(today, date);
      const price = this.getRandomPrice(1000, 15000);

      this.weekDates.push({ dateStr, price, isToday, date });
    }
  }

  isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  getRandomPrice(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  goToPreviousWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 1);
    this.generateWeekDates();
  }

  goToNextWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 1);
    this.generateWeekDates();
  }
}
