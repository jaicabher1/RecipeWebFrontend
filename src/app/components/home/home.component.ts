import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/user';
import { DashboardsComponent } from "./dashboards/dashboards.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule, DashboardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

   constructor(public userService: UserService) {}
  
    userName: string = '';

    ngOnInit(): void {
      const userId = this.userService.getMyUser()?._id;
      if (userId) {
        this.userService.getUserById(userId).subscribe((response) => {
          this.userName = response.user ? response.user.name : '';
        });
      }
    }
  
}
