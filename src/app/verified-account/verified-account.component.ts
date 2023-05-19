import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TokenStorageService } from '../service/token-storage.service';
import { UserService } from '../service/user.service';
import { EventBusService } from '../service/event-bus.service';
@Component({
  selector: 'app-verified-account',
  templateUrl: './verified-account.component.html',
  styleUrls: ['./verified-account.component.scss']
})
export class VerifiedAccountComponent implements OnInit {
  verifyToken: any = ''
  isVerified: boolean = false
  verifyMessage = ''
  test: any = {}
  eventBusSub?: Subscription
  constructor(private eventBusService: EventBusService, private tokenStorageService: TokenStorageService, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private userService: UserService) {

  }

  ngOnInit(): void {
    this.getVerifyToken()
  }

  getVerifyToken() {
    this.verifyToken = this.activatedRoute.snapshot.queryParamMap.get('verify-code')
    this.userService.getVerificationStatus(this.verifyToken).subscribe((res) => {
      this.isVerified = true
      this.logOut()
    }
      , error => {
        this.toastr.error(error.error.message)
        console.log(error.error.message);
      })
  }
  logOut(): void {
    this.tokenStorageService.signOut();
    setInterval(() =>
      location.href = '/login'
      , 2000)
  }
}
