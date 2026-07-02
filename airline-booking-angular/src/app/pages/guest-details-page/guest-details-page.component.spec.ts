import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDetailsPageComponent } from './guest-details-page.component';

describe('GuestDetailsPageComponent', () => {
  let component: GuestDetailsPageComponent;
  let fixture: ComponentFixture<GuestDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestDetailsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
