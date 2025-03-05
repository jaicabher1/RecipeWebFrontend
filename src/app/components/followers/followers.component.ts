import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-followers',
  imports: [CommonModule],
  templateUrl: './followers.component.html',
  styleUrl: './followers.component.css'
})
export class FollowersComponent implements OnInit {
  followers: any[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadFollowers();
  }

  loadFollowers(): void {
    const id = this.userService.getMyUser()?._id;
    if (!id) {
      return console.error('No se puede obtener el id del usuario');
    }
    this.userService.getFollowers(parseInt(id)).subscribe({
      next: (response) => {
        this.followers = response.follows;
      },
      error: (err) => {
        console.error('Error al obtener los seguidores:', err);
      }
    });
  }
}
