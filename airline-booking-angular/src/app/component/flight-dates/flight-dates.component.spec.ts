import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDatesComponent } from './flight-dates.component';

describe('FlightDatesComponent', () => {
  let component: FlightDatesComponent;
  let fixture: ComponentFixture<FlightDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightDatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
