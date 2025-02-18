import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = 'Register';
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
  }
}