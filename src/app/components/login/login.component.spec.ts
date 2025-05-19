import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar error si email o password están vacíos', () => {
    component.email = '';
    component.password = '';

    component.onSubmit();

    expect(component.errorEmail).toBe('El correo electrónico es obligatorio');
    expect(component.errorPassword).toBe('La contraseña es obligatoria');
    expect(userServiceSpy.login).not.toHaveBeenCalled();
  });

  it('debe hacer login exitosamente con token', fakeAsync(() => {
    component.email = 'test@test.com';
    component.password = '12345678';

    userServiceSpy.login.and.returnValue(of({ token: '123abc' }));

    component.onSubmit();
    tick();

    expect(component.successMessage).toBe('Login exitoso! Redirigiendo...');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('debe manejar login exitoso pero sin token', () => {
    component.email = 'test@test.com';
    component.password = '12345678';

    userServiceSpy.login.and.returnValue(of({}));

    component.onSubmit();

    expect(component.errorMessage).toBe('Login exitoso, pero no se recibió token');
  });

  it('debe manejar login con error de credenciales', () => {
    component.email = 'fail@test.com';
    component.password = 'wrong';

    userServiceSpy.login.and.returnValue(throwError(() => new Error('Credenciales inválidas')));

    component.onSubmit();

    expect(component.errorMessage).toBe('El correo electrónico o la contraseña son incorrectos');
  });

});
