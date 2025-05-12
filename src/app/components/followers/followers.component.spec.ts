import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FollowersComponent } from './followers.component';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';


describe('FollowersComponent', () => {
  let component: FollowersComponent;
  let fixture: ComponentFixture<FollowersComponent>;
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
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getFollowers']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FollowersComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FollowersComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar loadFollowers en ngOnInit', () => {
    spyOn(component, 'loadFollowers');
    component.ngOnInit();
    expect(component.loadFollowers).toHaveBeenCalled();
  });

  it('loadFollowers debe obtener seguidores si hay ID', () => {
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    const mockFollowers = [{ name: 'Ana' }];
    userServiceSpy.getFollowers.and.returnValue(of({ follows: mockFollowers }));

    component.loadFollowers();

    expect(component.followers).toEqual(mockFollowers);
  });

  it('loadFollowers debe manejar falta de ID', () => {
    spyOn(console, 'error');
    userServiceSpy.getMyUser.and.returnValue(null);

    component.loadFollowers();

    expect(console.error).toHaveBeenCalledWith('No se puede obtener el id del usuario');
  });

  it('loadFollowers debe manejar error HTTP', () => {
    spyOn(console, 'error');
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getFollowers.and.returnValue(throwError(() => new Error('error')));

    component.loadFollowers();

    expect(console.error).toHaveBeenCalled();
  });

  it('onSelectUser debe navegar al perfil', () => {
    component.onSelectUser('999');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile', '999']);
  });
});
