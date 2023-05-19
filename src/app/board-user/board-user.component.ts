import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { EventData } from '../model/event.class';
import { EventBusService } from '../service/event-bus.service';
import { TokenStorageService } from '../service/token-storage.service';
@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.scss']
})
export class BoardUserComponent implements OnInit {
content?:string
user:any
  constructor(private userService:UserService,private token:TokenStorageService,private eventBusService:EventBusService) { }

  ngOnInit(): void {
this.user= sessionStorage.getItem('auth-user');
console.log(this.user);

    
    this.userService.getUserBoard(this.user['token']).subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message||err.error||err.message
        if(err.status===403)
        this.eventBusService.emit(new EventData('logOut',null))
      }
    );
  }

}
