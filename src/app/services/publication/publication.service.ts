// publication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserService } from '../user/user.service';
import { Global } from '../global';

@Injectable({
  providedIn: 'root',
})
export class PublicationService {
  private url: string = Global.url;

  constructor(private http: HttpClient, private userService: UserService) {}

  getFollowedPublications(): Observable<any> {
    const token = this.userService.getToken();

    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this.http.get(this.url + 'followed-publications', { headers }).pipe(
      catchError((error) => {
        console.error('Error in getFollowedPublications:', error);
        return throwError(() => error);
      })
    );
  }

  getCounters(): Observable<any> {
    const token = this.userService.getToken();

    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token.trim());
    
    return this.http.get(this.url + 'counters', { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getMyPublications(): Observable<any> {
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this.http.get(this.url + 'getmypublications', { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  getPublicationById(id: string): Observable<any> {
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });
    return this.http.get(this.url + 'publication/' + id, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }


  updatePublication(publication: any): Observable<any> {
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim(),
      'Content-Type': 'application/json'
    });

    return this.http.put(this.url + 'update-publication/' + publication._id, publication, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  deletePublication(id: string): Observable<any> {
    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim()
    });

    return this.http.delete(this.url + 'delete-publication/' + id, { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  savePublication(publication: any): Observable<any> {
    let json = JSON.stringify(publication);

    const token = this.userService.getToken();
    if (!token) {
      return throwError(() => new Error('No token available'));
    }
    let headers = new HttpHeaders({
      'Authorization': token.trim(),
      'Content-Type': 'application/json'
    });
  
    return this.http.post(this.url + 'save-publication/', json,  { headers }).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

}