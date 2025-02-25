import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap} from 'rxjs';
import { User } from '../../models/user';
import { Global } from '../global';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = Global.url;
  constructor(private _http: HttpClient, private router: Router) {}

  register(user: User): Observable<any> {
    let json = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'register', json, { headers: headers });   
  } 
    
  login(email: string, password: string, gettoken: boolean = true): Observable<any> {
    const body = { email, password, gettoken };
    return this._http.post(this.url + 'login', body).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): User | null {
    const token = this.getToken();
    if (token) {
      // Decodifica el token para obtener la información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user = new User(payload.id, payload.name, payload.surname, payload.email, payload.nick,payload.password, payload.role, payload.bio, payload.location, payload.isVerified, payload.image, payload.phoneNumber);
      return user;
    }
    return null;
  }

}


