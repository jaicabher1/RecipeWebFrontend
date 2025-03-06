import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

   constructor(public userService: UserService) {}
  
    get userName(): string {
      const user = this.userService.getMyUser(); 
      return user ? user.name : '';
    }

  public sections = [
    {
      title: 'Recipe 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque efficitur commodo felis, sed convallis turpis.',
      imageUrl: 'assets/Image1.jpeg',
      imagePosition: 'right'  // Indica si la imagen va a la derecha o izquierda
    },
    {
      title: 'Recipe 2',
      description: 'Fusce finibus metus eu purus lobortis, a imperdiet ex accumsan. Donec sed hendrerit lorem, eget blandit sapien.',
      imageUrl: 'assets/Image2.jpeg',
      imagePosition: 'left'
    },
    {
      title: 'Recipe 3',
      description: 'Morbi a semper risus. Vestibulum at augue fermentum, dictum erat eu, pretium massa.',
      imageUrl: 'assets/Image3.jpeg',
      imagePosition: 'right'
    },
    {
      title: 'Recipe 4',
      description: 'Sed aliquam magna at turpis venenatis, sit amet interdum justo semper. In risus erat, consequat sed ultrices nec.',
      imageUrl: 'assets/Image4.jpeg',
      imagePosition: 'left'
    }
  ];
}
