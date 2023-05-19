import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { confirmField } from '../service/validator';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,private userService: UserService, private toastr: ToastrService) { 
this.passwordForm = formBuilder.group({
  token:['',[Validators.required]],
password:['',[Validators.required,Validators.minLength(6),Validators.maxLength(30)]],
confirmPassword:['',[Validators.minLength(6),Validators.maxLength(30)]]
},{validator:confirmField("password","confirmPassword")}
)
  }
  
  ngOnInit(): void {
  }
  invalidToken=false
  resetToken:any
  resetPassword:any
  isSubmitted=false
  passwordForm: FormGroup;
  getParams(resetToken:any,resetPassword:any){
    let params:any={}
    if(resetToken){
    params['token']=resetToken
    }
    if(resetPassword){
    params['password']=resetPassword     
    }
    return params
  }
updatePassword(){
  this.isSubmitted=true
  if(this.passwordForm.invalid){
       this.toastr.error('An error has occurred. Please check the fields and try again')
  }
  else{
  this.resetToken=this.passwordForm.controls['token'].value
  this.resetPassword=this.passwordForm.controls['password'].value
  const params=this.getParams(this.resetToken,this.resetPassword)
  return this.userService.sendResetPassword(params).subscribe((res)=>{
    this.isSubmitted=false
    this.invalidToken=false
    this.passwordForm.reset()
    this.toastr.info('Your password has been successfully updated! Please login again')
    setInterval(()=>location.href='/login',2000)
  },err=>{
    this.invalidToken=true
    this.toastr.error('Invalid or expired token')
  })
  }
  return 
}
}


