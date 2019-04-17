import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;

  registerForm: FormGroup;

  bsCalendarConfig: Partial<BsDatepickerConfig>;

  @Output()
  cancelRegistration = new EventEmitter();

  constructor(private authService: AuthService, private router: Router,
    private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.bsCalendarConfig = {
      containerClass: 'theme-red'
    };
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }, { validator: this.passwordValidationMatch });


  }

  passwordValidationMatch(f: FormGroup) {
    if (f.get('password').value === f.get('confirmPassword').value)
      return null;
    else return { 'mismatch': true };
  }

  isControlInvalid(name: string, forError?: string) {
    const ctrl = this.registerForm.get(name);
    if (!ctrl)
      return false;

    if (forError) {
      return ctrl.hasError(forError) && ctrl.touched;
    }
    return ctrl.errors && ctrl.touched;
  }

  register() {
    if (this.registerForm.valid) {
      let ok = false;
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success(`${this.user.knownAs}, your registration was successful!`);
        ok = true;
      },
        (err) => { this.alertify.error(err); },
        () => {
          if (ok) {
            this.authService.login(this.user).subscribe(
              () => { this.router.navigate(['/members']); }
            )

          }
        }
      );
    }
    // console.log(this.registerForm.value);
    // this.authService.register(this.model).subscribe(
    //   (next) => { this.alertify.success('Registration successful!'); },
    //   (error) => { this.alertify.error(error); }
    // );
  }

  cancel() {
    this.cancelRegistration.emit();
  }

}
