import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import e from 'cors';


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

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { } // Inyectar el servicio

  ngOnInit(): void {
    // 🔹 Obtener el ID de la URL
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id'); // Obtener el id de la URL
      if(userId)
      this.loadUserProfile(userId); 
      else
      this.loadUserProfile();
    });
  }

  loadUserProfile(id?:string): void {
    console.log('ID:', id);
    if(id){
      this.userService.getUserById(id).subscribe({
        next: (response) => {
          this.user = response.user;
          this.counters = response.counters;
        },
        error: (err) => {
          console.error('Error al obtener el perfil del usuario:', err);
        }
      });
    } else {
      this.user = this.userService.getMyUser(); // Obtiene los datos del usuario
      console.log('User:', this.user);
      this.userService.getCounters().subscribe({
        next: (counters) => {
          this.counters = counters;
        },
        error: (err) => {
          console.error('Error al obtener los contadores:', err);
        }
      });
    }
  }

  onFollowing() {
    this.router.navigate(['/followings']);
  }

  onFollowers() {
    this.router.navigate(['/followers']);
  }

  onMyPublications() {
    this.router.navigate(['/my-publications']);
  }



}
