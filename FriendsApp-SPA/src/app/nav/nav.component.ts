import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authSvr: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authSvr.login(this.model).subscribe(next => {
      console.log('logged in successfully');
      this.alertify.success('Logged in successfully');
    }, error=> {
      this.alertify.error(error);
    });
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout(){
    localStorage.removeItem('token');
    this.alertify.message('Logout successfully');
  }

}
