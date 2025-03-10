import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUserProfileComponent } from './get-user-profile.component';

describe('GetUserProfileComponent', () => {
  let component: GetUserProfileComponent;
  let fixture: ComponentFixture<GetUserProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetUserProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
