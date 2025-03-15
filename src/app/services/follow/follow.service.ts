import { Injectable } from '@angular/core';
import { Global } from '../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import { Follow } from '../../models/follow';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private url = Global.url;

  constructor(private _http: HttpClient, private router: Router, private userService: UserService) { }

  saveFollow(follow: Follow): Observable<any> {
    let json = JSON.stringify(follow);
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim(),
      'Content-Type': 'application/json'
    });

    return this._http.post(this.url + 'follow/', json,  { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deleteFollow(id:string): Observable<any> {
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this._http.delete(this.url + 'unfollow/', { headers,  body: { id: id } }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
