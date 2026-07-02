import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsStoriesComponent } from './sns-stories.component';

describe('SnsStoriesComponent', () => {
  let component: SnsStoriesComponent;
  let fixture: ComponentFixture<SnsStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnsStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnsStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
