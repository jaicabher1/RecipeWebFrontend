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

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.login(this.email, this.password, this.getToken).subscribe({
      next: (response) => {
        if (response.token) {
          this.successMessage = 'Login exitoso! Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }); // Redirige después de 2 segundos
        } else {
          this.errorMessage = 'Login exitoso, pero no se recibió token';
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.errorMessage = 'Error en el login. Verifica tus credenciales.';
      }
    });
  }

  ngOnInit(): void {
    console.log('Componente de login cargado');
  }
}