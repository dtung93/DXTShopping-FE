import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from './service/token-storage.service';
import { Subscription } from 'rxjs';
import { EventBusService } from './service/event-bus.service';
import { CartService } from './service/cart.service';
import { roleName } from './model/role.model';
import { HttpClient } from '@angular/common/http';
import { Spinkit } from 'ng-http-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  cart:any
  showCart=false
 totalItems=0
  hasWidth=false
  private roles:string[]=[]
  avatar?=''
  isLoggedIn=false
  showAdminBoard=false
  showModeratorBoard=false
  username?:string
  eventBusSub?:Subscription
  showSideMenu=false
  showMasterBoard=false;
  static totalItems: any;
  constructor(private toastr:ToastrService,private token:TokenStorageService){}

  ngOnInit(): void {
    this.isLoggedIn = !!this.token.getToken();
    if (this.isLoggedIn) {
      const user = this.token.getUser()
      this.avatar=user.avatar
      this.roles = user.roles;
      this.showMasterBoard=this.roles.includes(roleName.ma)&&this.token.getUser().enabled
      this.showAdminBoard = this.roles.includes(roleName.a)&&this.token.getUser().enabled
      this.username = user.username;
      if(this.showAdminBoard||this.showMasterBoard){
      this.openNavButton()
}
      else{
       
      }
    }
  }
  ngOnDestroy(): void {
    if (this.eventBusSub)
      this.eventBusSub.unsubscribe();
  }
openNavButton(){
  this.hasWidth=!this.hasWidth
}

}
