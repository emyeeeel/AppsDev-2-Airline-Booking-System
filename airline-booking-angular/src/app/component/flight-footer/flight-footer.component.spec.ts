import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFooterComponent } from './flight-footer.component';

describe('FlightFooterComponent', () => {
  let component: FlightFooterComponent;
  let fixture: ComponentFixture<FlightFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
