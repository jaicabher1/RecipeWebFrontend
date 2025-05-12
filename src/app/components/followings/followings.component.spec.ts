import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FollowingsComponent } from './followings.component';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';

describe('FollowingsComponent', () => {
  let component: FollowingsComponent;
  let fixture: ComponentFixture<FollowingsComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser = new User(
      '123',             // _id
      'John',            // name
      'Doe',             // surname
      'john@test.com',   // email
      'johndoe',         // nick
      '12345678',        // password
      'ROLE_USER',       // role
      '', '', false, '', ''
    );

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getFollowings']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FollowingsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FollowingsComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('loadfollowings debe obtener datos si hay ID', () => {
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    const mockData = [{ name: 'Luis' }];
    userServiceSpy.getFollowings.and.returnValue(of({ follows: mockData }));

    component.loadfollowings();

    expect(component.followings).toEqual(mockData);
  });

  it('loadfollowings debe manejar falta de ID', () => {
    spyOn(console, 'error');
    userServiceSpy.getMyUser.and.returnValue(null);

    component.loadfollowings();

    expect(console.error).toHaveBeenCalledWith('No se puede obtener el id del usuario');
  });

  it('loadfollowings debe manejar error HTTP', () => {
    spyOn(console, 'error');
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getFollowings.and.returnValue(throwError(() => new Error('error')));

    component.loadfollowings();

    expect(console.error).toHaveBeenCalled();
  });

  it('onSelectUser debe navegar al perfil', () => {
    component.onSelectUser('321');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile', '321']);
  });
});
