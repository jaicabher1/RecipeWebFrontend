import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-user-profile',
  templateUrl: './get-user-profile.component.html',
  styleUrls: ['./get-user-profile.component.css'],
  imports: [FormsModule, RouterLink],
  standalone: true
})
export class GetUserProfileComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.filteredUsers = [...this.users]; 
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getProfileByName(nick: string): void {
    this.filteredUsers = this.users.filter(u =>
      u.nick.toLowerCase().includes(nick.toLowerCase())
    );
  }
}
