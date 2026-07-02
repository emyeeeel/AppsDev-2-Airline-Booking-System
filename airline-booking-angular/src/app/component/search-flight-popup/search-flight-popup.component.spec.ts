import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlightPopupComponent } from './search-flight-popup.component';

describe('SearchFlightPopupComponent', () => {
  let component: SearchFlightPopupComponent;
  let fixture: ComponentFixture<SearchFlightPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlightPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlightPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
