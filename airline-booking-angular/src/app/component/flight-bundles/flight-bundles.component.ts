import { Component } from '@angular/core';

@Component({
  selector: 'app-flight-bundles',
  imports: [],
  templateUrl: './flight-bundles.component.html',
  styleUrl: './flight-bundles.component.scss'
})
export class FlightBundlesComponent {
  selectedBundle: string | null = null;

  toggleBundle(bundle: string): void {
    this.selectedBundle = this.selectedBundle === bundle ? null : bundle;
  }
}
