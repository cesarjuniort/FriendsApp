import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiBaseUrl = 'http://localhost:5000/api/auth/';

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.apiBaseUrl + 'login', model)
      .pipe(map((response: any) => {
        const user = response;
        if (user && user.token) {
          localStorage.setItem('token', user.token);
        }
      })
      )
  }
}
