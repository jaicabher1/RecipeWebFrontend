import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user/user.service';
import { of, throwError } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido si no se completa el nombre y el correo', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();
  });

  it('debe ser válido si el formulario tiene todos los campos correctamente llenados', () => {
    const form = component.registerForm;
    form.controls['name'].setValue('John');
    form.controls['email'].setValue('john@test.com');
    form.controls['nick'].setValue('johnny');
    form.controls['password'].setValue('123456');
    form.controls['phoneNumber'].setValue('+1234567890');
    
    expect(form.valid).toBeTruthy();
  });


  it('debe enviar el formulario si es válido y registrar un nuevo usuario', () => {
    const form = component.registerForm;
    form.controls['name'].setValue('John');
    form.controls['email'].setValue('john@test.com');
    form.controls['nick'].setValue('johnny');
    form.controls['password'].setValue('123456');
    form.controls['phoneNumber'].setValue('+1234567890');

    const mockResponse = { user: { _id: '1' } };
    userServiceSpy.register.and.returnValue(of(mockResponse));

    component.onSubmit();
    
    expect(userServiceSpy.register).toHaveBeenCalled();
    expect(component.status).toBe('success');
    expect(component.serverErrorMessage).toBe('✔ Registro exitoso. Redirigiendo...');
  });


});
