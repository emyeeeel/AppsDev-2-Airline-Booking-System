import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-progress',
  imports: [CommonModule],
  templateUrl: './booking-progress.component.html',
  styleUrl: './booking-progress.component.scss'
})
export class BookingProgressComponent {
  @Input() selectedIndex = 0;

  // Calculate progress percentage for the line
  get progressPercentage(): number {
    return this.selectedIndex / (this.steps.length - 1);
  }

  // Method to update the selected step
  setSelectedStep(step: number | string): void {
    if (typeof step === 'number') {
      this.selectedIndex = step;
    } else {
      const index = this.steps.findIndex(s => s.label === step);
      if (index !== -1) this.selectedIndex = index;
    }
  }
  
  steps = [
    {
      label: "Select Flight",
      not_yet: "https://cdn.media.amplience.net/i/cebupacificair/Select-Done?fmt=auto&maxW=1920&maxH=1920",
      done: "https://cdn.media.amplience.net/i/cebupacificair/Select-Done?fmt=auto&maxW=1920&maxH=1920"
    },
    {
      label: "Guest Details",
      not_yet: "https://cdn.media.amplience.net/i/cebupacificair/Guest-Notyet?fmt=auto&maxW=1920&maxH=1920",
      done: "https://cdn.media.amplience.net/i/cebupacificair/Guest-Done?fmt=auto&maxW=1920&maxH=1920"
    },
    {
      label: "Add ons",
      not_yet: "https://cdn.media.amplience.net/i/cebupacificair/Add-ons-Notyet?fmt=auto&maxW=1920&maxH=1920",
      done: "https://cdn.media.amplience.net/i/cebupacificair/Add-ons-Done?fmt=auto&maxW=1920&maxH=1920"
    },
    {
      label: "Payment",
      not_yet: "https://cdn.media.amplience.net/i/cebupacificair/Payment-Notyet?fmt=auto&maxW=1920&maxH=1920",
      done: "https://cdn.media.amplience.net/i/cebupacificair/Payment-Done?fmt=auto&maxW=1920&maxH=1920"
    },
    {
      label: "Confirmation",
      not_yet: "https://cdn.media.amplience.net/i/cebupacificair/Confirmation-Notyet?fmt=auto&maxW=1920&maxH=1920",
      done: "https://cdn.media.amplience.net/i/cebupacificair/Confirmation-Done?fmt=auto&maxW=1920&maxH=1920"
    },
  ]
}
