
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../service/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TokenStorageService } from '../service/token-storage.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private spinner:NgxSpinnerService,private authService:AuthService,private tokenStorage:TokenStorageService,private toastr:ToastrService) { }
  ngOnInit(): void {
    //display modal form when component is initiated
    this.openModal()
    if (this.tokenStorage.getToken()) {
      this.display='none'
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  updateRoles=[]
  internetError=false
  loginError=false
  display='none'
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  form: any = {
    username:null,
    email: null,
    password: null
  };
  openModal(){
    this.display='block'
  }
  onCloseHandled(){
    this.display='none'
  }



  //welcome message
  signInSuccess(username:string){
    this.toastr.success("Hello "+ username+"!")
  }
  //Get username, password and post it to API by http service. API authenticates and returns access token(and refresh token) depends on the role of the logged in account
  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {    
        console.log(data)   
        this.tokenStorage.saveToken(data.token);//save user access token to storage
        this.tokenStorage.saveRefreshToken(data.refreshToken)//save refresh token to storage
        this.tokenStorage.saveUser(data);//save user information to storage including tokens
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;//get user roles  
        this.spinner.show()
        setInterval(()=>location.href='/home',1000)   
      },
      //Error message if cannot or fail to communicate with API
      err => {
        if(err.status==401){
    
        this.loginError=true
        this.isLoginFailed = true;
        this.toastr.error('Login failed! An error has occured!')
      }
      else{
      this.isLoginFailed=true
      this.internetError=true
      this.toastr.error('Could not establish connection to server')
      }
    }
    );
  }
  //reload page
  reloadPage(): void {
    window.location.reload();
  }
}
