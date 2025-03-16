import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

   constructor(public userService: UserService) {}
  
    userName: string = '';

    ngOnInit(): void {
      const userId = this.userService.getMyUser()?._id;
      console.log(userId);
      if (userId) {
        this.userService.getUserById(userId).subscribe((response) => {
          console.log(response);
          this.userName = response.user ? response.user.name : '';
        });
      }
    }
  
}
