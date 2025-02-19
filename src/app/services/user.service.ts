import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = Global.url;
  constructor(public _http: HttpClient) {}

  register(){
    console.log(this.url);
  }
}


/*
ME HE QUEDADO EN QUE SI PONGO EN EL CONSTRUCTOR
 DEL COMPONENET EL USERSERVICE NO ME DIRIGE A LA RUTA REGISTER*/