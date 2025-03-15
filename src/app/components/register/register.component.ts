import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  public title: string;
  public status: string;
  public registerForm: FormGroup;
  public serverErrorMessage: string;  // Para mostrar el mensaje de error del servidor

  constructor(
    private formBuilder: FormBuilder,
    private __router: Router,
    private __userService: UserService
  ) {
    this.title = 'Registrarse';
    this.status = '';
    this.serverErrorMessage = '';

    // Inicializamos el formulario reactivo con sus validaciones
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      nick: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])/),  // Al menos una mayúscula
          Validators.pattern(/^(?=.*[0-9])/)   // Al menos un dígito
        ]
      ],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+34\d{9}$/)]],
      bio: ['', [Validators.maxLength(255)]],
      location: ['', [Validators.maxLength(100)]],
      image: [''],
      isVerified: [false]
    });
  }

  ngOnInit(): void {
    console.log('Componente de registro cargado');
  }

  onSubmit(): void {
    // Limpiamos mensajes previos
    this.serverErrorMessage = '';
    this.status = '';

    if (this.registerForm.valid) {
      const user = new User(
        '',
        this.registerForm.value.name,
        this.registerForm.value.surname,
        this.registerForm.value.email,
        this.registerForm.value.nick,
        this.registerForm.value.password,
        'ROLE_USER',
        this.registerForm.value.bio,
        this.registerForm.value.location,
        this.registerForm.value.isVerified,
        this.registerForm.value.image,
        this.registerForm.value.phoneNumber
      );

      this.__userService.register(user).subscribe({
        next: (response) => {
          // Si llega aquí, significa que el servidor respondió con status 2XX
          if (response.user && response.user._id) {
            this.status = 'success';
          } else {
            // Caso raro en que sea 2XX pero no venga user._id
            this.status = 'error';
            this.serverErrorMessage = 'Respuesta inesperada del servidor.';
          }
        },
        error: (errorResponse) => {
          // Aquí se capturan errores HTTP (4XX, 5XX, etc.)
          this.status = 'error';
          console.error('Error en el registro:', errorResponse);

          // Extraemos mensaje proveniente de errorResponse.error.message (si existe)
          this.serverErrorMessage = errorResponse.error?.message || 'Error al registrar el usuario. Inténtalo de nuevo.';
        }
      });
    } else {
      this.status = 'error';
      this.serverErrorMessage = 'Por favor, revisa los campos del formulario.';
    }
  }
}
