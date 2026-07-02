import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationPickerComponent } from './destination-picker.component';

describe('DestinationPickerComponent', () => {
  let component: DestinationPickerComponent;
  let fixture: ComponentFixture<DestinationPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinationPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
