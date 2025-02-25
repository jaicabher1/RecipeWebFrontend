import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;

  constructor(
    private __router: Router,
    private __userService: UserService
  ) {
    this.title = 'Register';
    this.status = '';
    this.user = new User(
      '',
      '',
      '',
      '',
      '',
      '',
      'ROLE_USER',
      '',
      '',
      false,
      '',
      '',
      new Date()
    );
  }

  ngOnInit(): void {
    console.log('Componente de registro cargado');
  }

  onSubmit() {
    console.log(this.user);
    this.__userService.register(this.user).subscribe(
      (response) => {
        if(response.user && response.user._id){
          console.log(response.user);
          this.status = 'success';
        } else {
          this.status = 'error';
        }
      },
      (error) => {
        console.log(<any>error);
      }
    );
  }
}