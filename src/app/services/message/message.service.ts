import { Injectable } from '@angular/core';
import { Global } from '../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private url: string = Global.url;

  constructor(private http: HttpClient, private userService: UserService) { }

  getMyMessages(): Observable<any> {
    const token = this.userService.getToken();

    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this.http.get(this.url + 'my-messages', { headers }).pipe(
      catchError((error) => {
        console.error('Error in getFollowedPublications:', error);
        return throwError(() => error);
      })
    );
  }

  getReceivedMessages(): Observable<any> {
    const token = this.userService.getToken();
    console.log(token);
    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this.http.get(this.url + 'received-messages', { headers }).pipe(
      catchError((error) => {
        console.error('Error in getFollowedPublications:', error);
        return throwError(() => error);
      })
    );
  }


  sendMessage(message: any): Observable<any> {
    const token = this.userService.getToken();
    let json = JSON.stringify(message);
    console.log(json);
    console.log(message);


    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    let headers = new HttpHeaders({
      'Authorization': token.trim(),
      'Content-Type': 'application/json'
    });

    return this.http.post(this.url + 'send-message', json, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getFollowedPublications:', error);
        return throwError(() => error);
      })
    );
  }

}
