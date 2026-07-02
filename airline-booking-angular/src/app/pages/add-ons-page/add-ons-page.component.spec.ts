import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnsPageComponent } from './add-ons-page.component';

describe('AddOnsPageComponent', () => {
  let component: AddOnsPageComponent;
  let fixture: ComponentFixture<AddOnsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOnsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
