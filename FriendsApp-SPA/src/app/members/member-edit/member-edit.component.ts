import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

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
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.user = data['userDataFromResolver']);
  }

  updateUser(){
    console.log('update: ', this.user);
    this.editForm.reset(this.user);
  }

}
