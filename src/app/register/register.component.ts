import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  constructor(private toastr:ToastrService,private authService:AuthService) { }
  ngOnInit(): void {
  }
form:any={
  username:null,
  email:null,
  password:null,
  avatar:null,
  address:null,
  phone:null
}
isSuccessful:boolean=false
isSignedUpFailed:boolean=false
errorMessage:string=''


currentFile: any
onFileSelected(event:any){
  if(event.target.files.length>0){
    console.log(event.target.files[0].name)
  }
}
signUpSuccessful(){
  this.isSuccessful=true
  this.isSignedUpFailed=false
  this.toastr.info('Your account has been successfully registered!')
  setInterval(()=>location.href='/login',3000) 
}

  onSubmit():void{
     
    const{username,email,password,avatar,phone,address}=this.form
    this.authService.register(username,password,address,email,phone,avatar).subscribe(res=>{
      this.errorMessage=''
      this.signUpSuccessful()
    },error=>{
      this.errorMessage=error.error.errorMessage
      this.isSignedUpFailed=true
    })
  }

}