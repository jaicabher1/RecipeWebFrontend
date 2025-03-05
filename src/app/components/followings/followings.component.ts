import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-followings',
  imports: [ CommonModule ],
  templateUrl: './followings.component.html',
  styleUrl: './followings.component.css'
})
export class FollowingsComponent {
  followings: any[] = [];
    constructor(private userService: UserService) { }
  
    ngOnInit(): void {
      this.loadfollowings();
    }
  
    loadfollowings(): void {
      const id = this.userService.getMyUser()?._id;
      console.log(id);
      if (!id) {
        return console.error('No se puede obtener el id del usuario');
      }
      this.userService.getFollowings(parseInt(id)).subscribe({
        next: (response) => {
          console.log(response);
          this.followings = response.follows;
        },
        error: (err) => {
          console.error('Error al obtener los seguidores:', err);
        }
      });
    }

}
