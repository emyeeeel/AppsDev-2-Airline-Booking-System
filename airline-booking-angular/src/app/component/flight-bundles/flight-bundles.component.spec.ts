import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBundlesComponent } from './flight-bundles.component';

describe('FlightBundlesComponent', () => {
  let component: FlightBundlesComponent;
  let fixture: ComponentFixture<FlightBundlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightBundlesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightBundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
