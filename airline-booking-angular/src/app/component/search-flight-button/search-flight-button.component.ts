import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-search-flight-button',
  imports: [],
  templateUrl: './search-flight-button.component.html',
  styleUrl: './search-flight-button.component.scss'
})
export class SearchFlightButtonComponent {
  @Input() text = 'Search Flight';
  @Input() selected = true; // Controls button state
  @Output() searchClicked = new EventEmitter<void>();

  onClick() {
    if (this.selected) { // Only emit if enabled (selected)
      this.searchClicked.emit();
    }
  }
}