import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  title : string;
  constructor() { 
    this.title = 'Login';
  }

  ngOnInit() {
    console.log('LoginComponent initialized');
  }

}
