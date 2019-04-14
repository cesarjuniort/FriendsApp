import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiBaseUrl = environment.apiUrl ;

  constructor(private http: HttpClient){}

  getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.apiBaseUrl + 'users');
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(this.apiBaseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.apiBaseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.apiBaseUrl + 'users/' + userId + '/photos/' + id + '/setAsMain',
           {});
  }

  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.apiBaseUrl + 'users/' + userId + '/photos/' + id);
  }

}