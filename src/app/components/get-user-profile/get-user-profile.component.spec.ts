import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetUserProfileComponent } from './get-user-profile.component';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('GetUserProfileComponent', () => {
  let component: GetUserProfileComponent;
  let fixture: ComponentFixture<GetUserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    new User('1', 'Ana', 'López', 'ana@test.com', 'ana123', '', 'ROLE_USER'),
    new User('2', 'Luis', 'Pérez', 'luis@test.com', 'luis456', '', 'ROLE_USER')
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [GetUserProfileComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(GetUserProfileComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe llamar a getUsers', () => {
    spyOn(component, 'getUsers');
    component.ngOnInit();
    expect(component.getUsers).toHaveBeenCalled();
  });

  it('getUsers debe cargar los usuarios correctamente', () => {
    userServiceSpy.getAllUsers.and.returnValue(of({ users: mockUsers }));

    component.getUsers();

    expect(userServiceSpy.getAllUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
  });

  it('getUsers debe manejar errores correctamente', () => {
    spyOn(console, 'error');
    userServiceSpy.getAllUsers.and.returnValue(throwError(() => new Error('error')));

    component.getUsers();

    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('getProfileByName debe filtrar por nick (coincidencia parcial)', () => {
    component.users = mockUsers;

    component.getProfileByName('ana');

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].nick).toBe('ana123');
  });

  it('getProfileByName debe ser case-insensitive', () => {
    component.users = mockUsers;

    component.getProfileByName('LUIS');

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].nick).toBe('luis456');
  });

  it('getProfileByName no debe encontrar resultados si no coincide nada', () => {
    component.users = mockUsers;

    component.getProfileByName('zzz');

    expect(component.filteredUsers.length).toBe(0);
  });
});
