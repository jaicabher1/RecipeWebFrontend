import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let followServiceSpy: jasmine.SpyObj<FollowService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUser', 'getUserById', 'getFollowings']);
    followServiceSpy = jasmine.createSpyObj('FollowService', ['saveFollow', 'deleteFollow']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    // Simulamos ActivatedRoute.paramMap como un observable que emite un Map con el id '1'
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      paramMap: of(new Map([['id', '1']])) // Simulando que el id es '1'
    });

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: FollowService, useValue: followServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe cargar el perfil de usuario correctamente', () => {
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');
    const mockCounters = { following: 10, followed: 20, publications: 5, showButton: true };

    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getUserById.and.returnValue(of({ user: mockUser, following: 10, followed: 20, publications: 5 }));

    component.ngOnInit();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith('1');
    expect(component.user).toEqual(mockUser);
    expect(component.counters).toEqual(mockCounters);
  });

  it('getIsFollowing debe retornar verdadero si el usuario está siguiendo', () => {
    const followedId = '2';
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');
    const mockFollows = [{ followed: { _id: '2' } }];
    
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getFollowings.and.returnValue(of({ follows: mockFollows }));

    component.getIsFollowing(followedId);

    expect(component.isFollowing).toBeTrue();
  });

  it('getIsFollowing debe retornar falso si el usuario no está siguiendo', () => {
    const followedId = '2';
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');
    const mockFollows = [{ followed: { _id: '3' } }];
    
    userServiceSpy.getMyUser.and.returnValue(mockUser);
    userServiceSpy.getFollowings.and.returnValue(of({ follows: mockFollows }));

    component.getIsFollowing(followedId);

    expect(component.isFollowing).toBeFalse();
  });

  it('onFollow debe llamar al servicio de follow y actualizar el estado', () => {
    const followedId = '2';
    const mockFollow = new Follow('', '1', followedId);
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');

    followServiceSpy.saveFollow.and.returnValue(of({}));
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    component.onFollow(followedId);

    expect(followServiceSpy.saveFollow).toHaveBeenCalledWith(mockFollow);
    expect(component.isFollowing).toBeTrue();
    expect(component.followMessage).toBe('✔ Solicitud de seguimiento enviada correctamente');
  });

  it('onUnfollow debe llamar al servicio de unfollow y actualizar el estado', () => {
    const followedId = '2';
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');

    followServiceSpy.deleteFollow.and.returnValue(of({}));
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    component.onUnfollow(followedId);

    expect(followServiceSpy.deleteFollow).toHaveBeenCalledWith(followedId);
    expect(component.isFollowing).toBeFalse();
    expect(component.followMessage).toBe('✔ Dejaste de seguir a este usuario');
  });

  it('onFollow debe manejar el error correctamente', () => {
    const followedId = '2';
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');

    followServiceSpy.saveFollow.and.returnValue(throwError(() => new Error('Error al seguir al usuario')));
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    component.onFollow(followedId);

    expect(component.followMessageType).toBe('error');
    expect(component.followMessage).toContain('❌ Error al seguir al usuario');
  });

  it('onUnfollow debe manejar el error correctamente', () => {
    const followedId = '2';
    const mockUser = new User('1', 'Carlos', 'Gómez', 'carlos@ejemplo.com', 'carlos123', '', 'ROLE_USER');

    followServiceSpy.deleteFollow.and.returnValue(throwError(() => new Error('Error al dejar de seguir al usuario')));
    userServiceSpy.getMyUser.and.returnValue(mockUser);

    component.onUnfollow(followedId);

    expect(component.followMessageType).toBe('error');
    expect(component.followMessage).toContain('❌ Error al dejar de seguir al usuario');
  });

  it('onFollowing debe redirigir a la página de followings', () => {
    component.onFollowing();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/followings']);
  });

  it('onFollowers debe redirigir a la página de followers', () => {
    component.onFollowers();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/followers']);
  });

  it('onMyPublications debe redirigir a la página de publicaciones del usuario', () => {
    component.followedId = '2';
    component.onMyPublications();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/publications/2']);
  });

  it('onEditProfile debe redirigir a la página de edición de perfil', () => {
    component.onEditProfile();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit-profile']);
  });
});
