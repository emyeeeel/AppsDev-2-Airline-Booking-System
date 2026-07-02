import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProgressComponent } from './booking-progress.component';

describe('BookingProgressComponent', () => {
  let component: BookingProgressComponent;
  let fixture: ComponentFixture<BookingProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
