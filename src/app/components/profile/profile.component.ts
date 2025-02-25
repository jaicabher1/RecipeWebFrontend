import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null; // Variable para almacenar los datos del usuario

  constructor(private userService: UserService) {} // Inyectar el servicio

  ngOnInit(): void {
    this.loadUserProfile(); // Llama al método para cargar el perfil del usuario
  }

  loadUserProfile(): void {
    this.user = this.userService.getUser(); // Obtiene los datos del usuario
    console.log("AQUIIIII"); // Muestra los datos del usuario en la consola
    console.log(this.user); // Muestra los datos del usuario en la consola
  }
}
