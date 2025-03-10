import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user'; // Asegúrate de importar tu modelo
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-user-profile',
  templateUrl: './get-user-profile.component.html',
  styleUrls: ['./get-user-profile.component.css'],
  imports: [FormsModule, RouterLink]
})
export class GetUserProfileComponent {

  users: User[] = [];              // Lista completa
  filteredUsers: User[] = [];     // Lista filtrada
  searchTerm: string = '';        // Término de búsqueda

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.getUsers(); // solo una vez al inicio
  }
  
  getUsers() {
    this.userService.getAllUsers().subscribe(
      response => {
        this.users = response.users;
        this.filteredUsers; // copiar todos los usuarios al inicio
      },
      error => {
        console.log(error);
      }
    );
  }
  
  getProfileByName(nick: string) {
    this.filteredUsers = this.users.filter(u =>
      u.nick.toLowerCase().includes(nick.toLowerCase())
    );
  }
  
}
