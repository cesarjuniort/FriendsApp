import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  pagination: Pagination;

  constructor(private userService: UserService, private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['userListFromResolver'].result;
      this.pagination = data['userListFromResolver'].pagination;
    })

  }

  onPageChanged($event){
    this.pagination.currentPage = $event.page;
    this.loadUsers();
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage).subscribe(
      (data: PaginatedResult<User[]>) => {
        this.users = data.result;
        this.pagination = data.pagination;
      },
      (err) => {this.alertify.error(err);}
    );
  }

}
