import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../service/token-storage.service';
import { UserService } from '../service/user.service';
import Swal from 'sweetalert2';
import { User } from '../model/user.model';
import { ConsoleLogger } from '@angular/compiler-cli';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmField } from '../service/validator';
import { roleName } from '../model/role.model';
import { FileUploadService } from '../service/file-upload.service';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private uploadService: FileUploadService, private fb: FormBuilder, private token: TokenStorageService, private userService: UserService, private toastr: ToastrService) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]]
    }, { validator: confirmField('newPassword', 'confirmNewPassword') })
    this.updateProfileForm = this.fb.group({
      id: [null],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {
    if (this.token.getToken()) {
      let userId = this.token.getUser().id
      this.getDefaultImage(userId)
      this.userId = userId
      this.userService.getUser(userId).subscribe((res) => {
        this.selectedUser = res
        this.updateProfileForm.patchValue({
          id: this.selectedUser.id,
          email: this.selectedUser.email,
          phone: this.selectedUser.phone,
          address: this.selectedUser.address
        })
        if (this.selectedUser.enabled == true) {
          if (this.selectedUser.roles.find((element) => element.name == roleName.ma)) {
            this.isMaster = true
          }
          if (this.selectedUser.roles.find(element => element.name == roleName.a)) {
            this.isAdmin = true
        
          }
          if (this.selectedUser.roles.find(element => element.name == roleName.mo)) {
            this.isModerator = true
       
          }
        }
        else {
          this.isDisabled = true
          this.toastr.error('Account not activated!')
        }
      })

    }
  }

  noImage:boolean=false
  uploadError: string = ''
  imageSrc: any
  address: any
  phone: any
  email: any
  updateError = false
  pushBottom = false
  username: string = ''
  updateIsSubmitted = false
  isSubmitted = false
  changePasswordForm: FormGroup
  updateProfileForm: FormGroup
  passwordError: string = ''
  roleSelected: any = null
  display = 'none'
  isDisabled = false
  isAdmin = false
  isModerator = false
  isUser = false
  isMaster = false
  selectedUser = new User()
  selectedUserRoles: any[] = []
  width = 'width:100%;backround-color:#145580'
  updateProfileError = ''
  selectedFile?: FileList;
  currentFile?: File;
  userId: string = ''
  defaultImage:string=''
  selectedRoles: any = [
    { id: 1, name: 'ROLE_USER', tag: 'User' },
    { id: 2, name: 'ROLE_MODERATOR', tag: 'Moderator' }, { id: 3, name: "ROLE_ADMIN", tag: 'Admin' }
  ]
  @ViewChild('closeUpload') closeUpload?:ElementRef
  @ViewChild('closeUpdateModal') closeUpdateModal?: ElementRef
  @ViewChild('closeChangePassword') closeChangePassword?: ElementRef
  @ViewChild('closeDeletePicture') closeDeletePicture?:ElementRef
  getUserDetail(id: number) {
    this.userService.getUser(id).subscribe((res) => {
      this.selectedUser = res
      this.selectedUser.roles = res.roles
      this.email = res.email
      this.phone = res.phone
      this.address = res.address
    })
  }
  getDefaultImage(userId:string){
        this.defaultImage='http://localhost:8080/api/file/' + userId
  }
 noImageFound(event:any){
   this.noImage=true
   event.target.src='/assets/img/noimage.jpg'
 }
  selectFile(event: any): void {
    this.selectedFile = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => { this.imageSrc = reader.result; }

      reader.readAsDataURL(file);
    }
  }
  upload(): void {

    if (this.selectedFile) {
      const file: File | null = this.selectedFile.item(0);
      const userId: string | null = this.userId
      if (file && userId) {
        this.currentFile = file;
        this.uploadService.upload(userId, this.currentFile).subscribe((res: any) => {
          this.closeUpload?.nativeElement.click()
          this.imageSrc=null
          this.toastr.info('Your profile picture has been updated!')
          location.reload()
        }, (err: any) => {
         this.toastr.error(err.error.message)
        }
        );
      }
      this.selectedFile = undefined;
    }
  }
  deletePicture(){
  
     this.uploadService.deleteFile(this.userId).subscribe(()=>{
       this.closeDeletePicture?.nativeElement.click()
       this.toastr.info('Your profile photo has been deleted')
     },error=>{this.toastr.error(error.error.errorMessage)})
  }
  closeModal() {
    this.display = 'none'
  }
  userModal() {
    this.display = 'block'
  }
  updateRole(): void {
    const data = {
      id: this.selectedUser.id,
      roles: this.selectedUser.roles
    }
    this.userService.updateRole(data).subscribe((res) => {
      this.display = 'none'
      this.toastr.info('Your role has changed! Please login again')
      setInterval(
        () => {
          window.location.href = '/home', 1000
          this.token.signOut()
        }
      )
    })
  }
  updateUser(): void {
    this.updateIsSubmitted = true
    const data = {
      user: {
        id: this.selectedUser.id,
        email: this.selectedUser.email,
        username: this.selectedUser.username,
        password: this.selectedUser.password,
        address: this.selectedUser.address,
        phone: this.selectedUser.phone,
      }
      , email: this.updateProfileForm.controls['email'].value,
      phone: this.updateProfileForm.controls['phone'].value,
      address: this.updateProfileForm.controls['address'].value,
      roles: [
        this.selectedUser.roles[0]
      ]
    }
    if (this.updateProfileForm.invalid) {
      this.toastr.error('Please check your inputs again!')
    }
    else {
      this.userService.updateUser(data).subscribe((res) => {
        this.closeUpdateModal?.nativeElement.click();
        this.toastr.info("Your account is updated!")
        this.updateError = false
      }, error => {
        this.updateError = true
        this.updateProfileError = error.error.errorMessage
      })
    }

  }
  removeUpdateError() {
    this.updateProfileForm.patchValue({
      id: this.selectedUser.id,
      email: this.selectedUser.email,
      phone: this.selectedUser.phone,
      address: this.selectedUser.address
    })
    this.updateError = false
  }
  addRole(id: any) {
    if (this.checkRole(id)) {
      this.selectedUser.roles.push(this.roleSelected)
    }
  }
  checkRole(id: any) {
    const existRole = this.selectedUser.roles.find((role: any) => role.id === id)
    return (this.selectedUser.roles
      && this.selectedUser.roles.length < 1
      && !existRole)
  }

  onChangeRole(event: any) {
    const roleUpdate = this.selectedRoles.find((r: any) => r.id == event.target.value)
    const roleParam = {
      id: roleUpdate.id,
      name: roleUpdate.name
    }
    this.selectedUser.roles = [roleParam];
  }
  submitChangePasswordForm() {
    this.isSubmitted = true
    if (this.changePasswordForm.invalid) {
      this.passwordError = "Error when updating password"
      this.pushBottom = true
    }
    else {
      this.pushBottom = false
      const data = {
        username: this.selectedUser.username,
        oldPassword: this.changePasswordForm.controls['oldPassword'].value,
        newPassword: this.changePasswordForm.controls['newPassword'].value
      }
      this.userService.changePassword(data).subscribe((res) => {
        this.closeChangePassword?.nativeElement.click()
        this.toastr.info('Password successfully changed! Please login again')
        setInterval(
          () => {
            window.location.href = '/login', 1000
            this.token.signOut()
          }
        )
      }, error => { this.passwordError = "You have entered a " + error.error.errorMessage })
    }
  }
  resetForm() {
    this.pushBottom = false
    this.isSubmitted = false
  }
}
