import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';  // Importar CommonModule
import { ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule]  // Asegúrate de incluir estos en el array 'imports'
})
export class RegisterComponent implements OnInit {
  public title: string;
  public status: string;
  public registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private __router: Router,
    private __userService: UserService
  ) {
    this.title = 'Registrarse';
    this.status = '';

    // Inicializamos el formulario reactivo con sus validaciones
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      nick: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])/), Validators.pattern(/^(?=.*[0-9])/)]],
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

      this.__userService.register(user).subscribe(
        (response) => {
          if (response.user && response.user._id) {
            this.status = 'success';
          } else {
            this.status = 'error';
          }
        },
        (error) => {
          this.status = 'error';
        }
      );
    }
  }
}
