import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;

  constructor(public _http: HttpClient) {
    this.url = Global.url;
  }

  register(){
    console.log(this.url);
  }
}



ME HE QUEDADO EN QUE SI PONGO EN EL CONSTRUCTOR
 DEL COMPONENET EL USERSERVICE NO ME DIRIGE A LA RUTA REGISTER