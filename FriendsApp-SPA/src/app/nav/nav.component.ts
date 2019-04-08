import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(public authSvr: AuthService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.authSvr.login(this.model).subscribe(next => {
      console.log('logged in successfully');
      this.alertify.success('Logged in successfully');
      this.router.navigate(['/members']);
    }, error=> {
      this.alertify.error(error);
    });
  }

  loggedIn() {
    return this.authSvr.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this.alertify.message('Logout successfully');
    this.router.navigate(['/home']);

  }

}
