import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { UserService } from '../../services/user/user.service';
import { of } from 'rxjs';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { DashboardsComponent } from './dashboards/dashboards.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUser = new User('1', 'Juan', 'Pérez', 'juan@test.com', 'juan123', '', 'ROLE_USER');

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getUserById']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule, DashboardsComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar el nombre del usuario si hay ID', () => {
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getUserById.and.returnValue(of({ user: mockUser }));

    component.ngOnInit();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('1');
    expect(component.userName).toBe('Juan');
  });

  it('ngOnInit no debe llamar a getUserById si no hay ID', () => {
    userServiceSpy.getMyUser.and.returnValue(null);

    component.ngOnInit();

    expect(userServiceSpy.getUserById).not.toHaveBeenCalled();
    expect(component.userName).toBe('');
  });
});
