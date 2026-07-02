import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheapFlightsComponent } from './cheap-flights.component';

describe('CheapFlightsComponent', () => {
  let component: CheapFlightsComponent;
  let fixture: ComponentFixture<CheapFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheapFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheapFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
