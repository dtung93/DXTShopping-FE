import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { roleName } from '../model/role.model';
import { CartService } from '../service/cart.service';
import { EventBusService } from '../service/event-bus.service';
import { TokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userOrder=false
  userId:any
  constructor(private cartService:CartService,private eventBusService:EventBusService,private tokenStorageService:TokenStorageService) { }
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.userId=this.tokenStorageService.getUser().id
      console.log(this.userId)
      const user = this.tokenStorageService.getUser(); 
     if(user.roles.includes(roleName.u)){
       this.showCart=true
     this.cartService.getCart().subscribe((res)=>{
       this.totalItems=res.totalItems;
     })
     if(user.enabled){
      this.userOrder=true
      }
    }
      this.avatar=user.avatar
      this.roles = user.roles;
      this.showMasterBoard=this.roles.includes(roleName.ma)
      this.showAdminBoard = this.roles.includes(roleName.a)
      this.username = user.username;
      if(this.showAdminBoard||this.showMasterBoard){
      this.openNavButton()
}
      else{}
    }
    else{
    this.eventBusSub = this.eventBusService.on('logOut', () => {
      this.logOut();
    });}
  }
  cart:any
  showCart=false
 totalItems=0
  hasWidth=false
  private roles:string[]=[]
  avatar?=''
  isLoggedIn=false
  showFooter=false
  showAdminBoard=false
  showModeratorBoard=false
  username?:string
  eventBusSub?:Subscription
  showSideMenu=false
  showMasterBoard=false;
  @ViewChild('openSideBar') openSideBar?: ElementRef 


 
  openNavButton(){
    this.hasWidth=!this.hasWidth
  }

  logOut(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    this.roles = [];
    this.showAdminBoard = false;
    this.showModeratorBoard = false;
    this.showMasterBoard=false
  }
}
