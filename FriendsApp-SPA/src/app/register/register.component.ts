import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};

  registerForm: FormGroup;

  bsCalendarConfig: Partial<BsDatepickerConfig>;

  @Output()
  cancelRegistration = new EventEmitter();

  constructor(private authService: AuthService,
    private alertify: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.bsCalendarConfig = {
      containerClass:'theme-red'
    };
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required,Validators.minLength(5)]],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    }, {validator:this.passwordValidationMatch});
    
    
  }

  passwordValidationMatch(f: FormGroup){
    if (f.get('password').value === f.get('confirmPassword').value)
      return null;
    else return {'mismatch':true};
  }

  isControlInvalid(name:string, forError?:string){
    const ctrl = this.registerForm.get(name);
    if(!ctrl)
      return false;

    if(forError){
      return ctrl.hasError(forError) && ctrl.touched;
    } 
    return ctrl.errors && ctrl.touched;
  }

  register() {
    console.log(this.registerForm.value);
    // this.authService.register(this.model).subscribe(
    //   (next) => { this.alertify.success('Registration successful!'); },
    //   (error) => { this.alertify.error(error); }
    // );
  }

  cancel() {
    this.cancelRegistration.emit();
  }

}
