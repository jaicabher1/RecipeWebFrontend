import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../models/user';
import { Global } from '../global';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = Global.url;
  constructor(private _http: HttpClient, private router: Router) { }

  register(user: User): Observable<any> {
    let json = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'register', json, { headers: headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
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

  getMyUser(): User | null {
    const token = this.getToken();
    if (token) {
      try {
        // Decodifica el payload del token
        const payloadBase64 = token.split('.')[1]; // Obtiene el payload en base64
        const decodedPayload = atob(payloadBase64); // Decodifica el base64
        
        // Convierte la cadena decodificada a un array de bytes
        const byteArray = new Uint8Array(decodedPayload.length);
        for (let i = 0; i < decodedPayload.length; i++) {
          byteArray[i] = decodedPayload.charCodeAt(i);
        }
  
        // Decodifica el array de bytes como UTF-8
        const utf8Decoder = new TextDecoder('utf-8');
        const payload = JSON.parse(utf8Decoder.decode(byteArray));
  
        // Crea y retorna el objeto User
        const user = new User(
          payload.sub,
          payload.name,
          payload.surname,
          payload.email,
          payload.nick,
          payload.password,
          payload.role,
          payload.bio,
          payload.location,
          payload.isVerified,
          payload.image,
          payload.phoneNumber
        );
        return user;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  }
  
  getUserById(id: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });
    
    return this._http.get(this.url + 'user/' + id,{ headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getCounters(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });
    return this._http.get(this.url + 'counters', { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  getFollowers(userId: string | undefined): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this._http.get(this.url + 'followers/' + userId, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getFollowings(userId: string | undefined): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this._http.get(this.url + 'following/' + userId, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getAllUsers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });
    return this._http.get(this.url + 'users', { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  updateUser(_id: string, user: User): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim(),
      'Content-Type': 'application/json'
    });
  
    return this._http.put(this.url + 'update-user/' + user._id, user, { headers })
      .pipe(
      catchError((error) => throwError(() => error))
      );
  }

  uploadImage(userId: string, file: File) {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
  
    const formData = new FormData();
    formData.append('image', file, file.name); // asegúrate de que el nombre sea "image" como en tu backend
  
    const headers = new HttpHeaders().set('Authorization', token.trim());
  
    return this._http.post(
      this.url + 'upload-image-user/' + userId,
      formData,
      { headers }
    ).pipe(
      catchError((error) => throwError(() => error))
    );
  }
  
}
