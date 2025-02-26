import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  getToken: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';
  errorEmail: string = '';
  errorPassword: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void { 
  
    if (!this.email.trim()) {
      this.errorEmail = 'El correo electrónico es obligatorio';
    } else {
      this.errorEmail = '';
    }
  
    if (!this.password.trim()) {
      this.errorPassword = 'La contraseña es obligatoria';
    } else {
      this.errorPassword = '';
    }
  
    if (this.errorEmail || this.errorPassword) {
      return;
    }
  
    this.userService.login(this.email, this.password, this.getToken).subscribe({
      next: (response) => {
        if (response.token) {
          this.successMessage = 'Login exitoso! Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }); 
        } else {
          this.errorMessage = 'Login exitoso, pero no se recibió token';
        }
      },
      error: () => {
        this.errorMessage = 'El correo electrónico o la contraseña son incorrectos';
      }
    });
  }
  

  ngOnInit(): void {
    console.log('Componente de login cargado');
  }
}