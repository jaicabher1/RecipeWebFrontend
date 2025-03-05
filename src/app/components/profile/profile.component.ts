import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: User | null = null; // Variable para almacenar los datos del usuario
  counters: any = null; // Variable para almacenar los contadores

  constructor(private userService: UserService, private router: Router) { } // Inyectar el servicio

  ngOnInit(): void {
    this.loadUserProfile(); // Llama al método para cargar el perfil del usuario
  }

  loadUserProfile(): void {
    this.user = this.userService.getMyUser(); // Obtiene los datos del usuario
    this.userService.getCounters().subscribe({
      next: (counters) => {
        this.counters = counters;
      },
      error: (err) => {
        console.error('Error al obtener los contadores:', err);
      }
    });
  }

  goToFollowing() {
    this.router.navigate(['/followings']);
  }

  goToFollowers() {
    this.router.navigate(['/followers']);
  }

  goToMyPublications() {
    this.router.navigate(['/my-publications']);
  }



}
