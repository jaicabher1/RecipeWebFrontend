import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  title : string;
  constructor() { 
    this.title = 'Register';
  }

  ngOnInit() {
    console.log('RegisterComponent initialized');
  }

}
