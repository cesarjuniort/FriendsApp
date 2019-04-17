import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { PaginatedResult } from '../models/pagination';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(page?, itemsPerPage?): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    return this.http.get<User[]>(this.apiBaseUrl + 'users', { observe: 'response', params })
      .pipe(
        map( resp => {
          paginatedResult.result = resp.body;
          const pageInfo = resp.headers.get('Pagination');
          if(pageInfo != null) {
            paginatedResult.pagination = JSON.parse(pageInfo);
          }
          return paginatedResult;
        })
      );
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