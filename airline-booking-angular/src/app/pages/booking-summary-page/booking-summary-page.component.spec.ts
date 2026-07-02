import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSummaryPageComponent } from './booking-summary-page.component';

describe('BookingSummaryPageComponent', () => {
  let component: BookingSummaryPageComponent;
  let fixture: ComponentFixture<BookingSummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSummaryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
