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
  registerForm: FormGroup;
  status: 'success' | 'error' | '' = '';
  serverErrorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      nick: ['', Validators.required],
      password: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      bio: ['', Validators.maxLength(250)],
      location: ['', Validators.maxLength(100)],
      isVerified: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.status = '';
    this.serverErrorMessage = '';

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
        '', // imagen por defecto
        this.registerForm.value.phoneNumber
      );

      this.userService.register(user).subscribe({
        next: (res) => {
          if (res.user && res.user._id) {
            this.status = 'success';
            this.serverErrorMessage = '✔ Registro exitoso. Redirigiendo...';
            setTimeout(() => this.router.navigate(['/login']), 2000);
          } else {
            this.status = 'error';
            this.serverErrorMessage = '❌ Registro fallido.';
          }
        },
        error: (err) => {
          this.status = 'error';
          this.serverErrorMessage = err.error?.message || '❌ Error al registrar.';
        }
      });
    } else {
      this.status = 'error';
      this.serverErrorMessage = '❌ Revisa los campos marcados con *.';
    }
  }
}
