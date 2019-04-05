import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};

  @Output()
  cancelRegistration = new EventEmitter();

  constructor(private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(
      (next) => { this.alertify.success('Registration successful!'); },
      (error) => { this.alertify.error(error); }
    );
  }

  cancel() {
    this.cancelRegistration.emit();
  }

}
