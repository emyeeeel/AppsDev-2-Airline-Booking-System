import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFlightButtonComponent } from './search-flight-button.component';

describe('SearchFlightButtonComponent', () => {
  let component: SearchFlightButtonComponent;
  let fixture: ComponentFixture<SearchFlightButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFlightButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFlightButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
