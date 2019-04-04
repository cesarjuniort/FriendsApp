import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authSvr: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authSvr.login(this.model).subscribe(next => {
      console.log('logged in successfully');
    }, error=> {
      console.warn('fail to login successfully');
    });
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
  }

}
