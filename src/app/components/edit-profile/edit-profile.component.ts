import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  // NO SE ACTUALIZA NI EN HOME COMPONENT NI EN EDIT PROFILE COMPONENT

  user: User = new User();
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  subscription: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const currentUserId = this.userService.getMyUser()?._id;
    if (currentUserId) {
      this.userService.getUserById(currentUserId).subscribe({
        next: (response) => {
          console.log(response.user);
          this.user = response.user;
        },
        error: (error) => {
          this.message = `❌ Error: ${error.error?.message || error.message}`;
          this.messageType = 'error';
        }
      });
    } else {
      // Handle the case when no user is found
      this.message = '❌ Error: Usuario no encontrado';
      this.messageType = 'error';
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (!this.user._id) {
      this.message = '❌ Error: ID de usuario no disponible';
      this.messageType = 'error';
      return;
    }
    
    this.userService.updateUser(this.user._id, this.user).subscribe({
      next: () => {
        this.message = '✔ Perfil actualizado correctamente';
        this.messageType = 'success';
        setTimeout(() => this.router.navigate(['/profile', this.user._id]), 1000);
      },
      error: (error) => {
        this.message = `❌ Error al actualizar perfil: ${error.error?.message || error.message}`;
        this.messageType = 'error';
      }
    });
  }

}
