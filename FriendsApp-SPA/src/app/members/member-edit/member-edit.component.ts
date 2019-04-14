import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;

  @HostListener('window:beforeunload', ['$event'])
  windowUnloadEvent($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }


  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.user = data['userDataFromResolver']);
  }

  updateUser(){
    this.userService.updateUser(this.authService.decodedToken.nameid,
      this.user).subscribe(
        next => {
          this.editForm.reset(this.user);
          this.alertify.success('Your profile was updated successfully!');
        },
        err => {this.alertify.error(err);}
      );
  }

  updateMainPhoto($event){
    this.user.photoUrl = $event;
  }

}
