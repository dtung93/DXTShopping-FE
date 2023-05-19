import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../model/user.model';
import { ToastrService } from 'ngx-toastr';
import { ConsoleLogger } from '@angular/compiler-cli/private/localize';
import { TokenStorageService } from '../service/token-storage.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { roleName } from '../model/role.model';
import { Paging } from '../model/page.model';
@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.scss']
})
export class BoardAdminComponent implements OnInit {
  constructor(private fb:FormBuilder,private userService: UserService, private toastr: ToastrService, private token: TokenStorageService) {
    this.updateUserForm=this.fb.group({
        id:[null],
        username:[''],
        address:[''],
        phone:['',[Validators.required]],
        email:['',[Validators.required,Validators.email]]
    })
  }
  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(res => {
      this.content = res
    }, error => { this.content = JSON.parse(error.error).message })
    this.getUsers()
    if (this.token.getToken()) {
      this.currentUserRole = this.token.getUser().roles
      this.currentUsername = this.token.getUser().username
      if (this.currentUserRole == roleName.ma)
        this.isMaster = true
      if (this.currentUserRole == roleName.a)
        this.isAdmin = true
    }
  }
  updateUserForm:FormGroup
  error=false
  email:any
  address:any
  phone:any
  username:any
  updateError=''
  isSubmitted=false
  userForm!: FormGroup 
  isAdmin = false
  isMaster = false
  currentUserRole = '';
  currentUsername: any
  usernameoremail:string=''
  roleSelected={id:null,name:''}
  font = 'font-family:optima'
  padding = 'padding:5'
  info = 'background-color:#97C5E3 ;margin:10px 15px 10px 5px;text-align:center;color:snow;font-size:25px'
  title = 'color:#638BA6;font-size:3rem;font-weight:bold'
  category = 'color:#A95C68;font-size:1rem'
  description = 'color:grey;font-weight:bold;font-size:15px;text-align:left'
  price = 'color:smoke;font-weight:bolder;font-size:2rem'
  edit = 'color:white;font-size:20px;width:100%;background-color:#2179B3'
  width = 'width:100%;backround-color:#145580'
  @ViewChild('closeDeleteModal') closeDeleteModal?: ElementRef 
  selectedUser = new User()
  oldUser=new User()
  content?: string
  categories: any = [
    { name: 'Shoes' }, { name: 'Cars' }, { name: 'Health' },
    { name: 'Computers' }, { name: 'Garden' }, { name: 'Beauty' },
    { name: 'Home' }, { name: 'Clothing' }, { name: 'Sports' }, { name: 'Grocery' }
  ]
  selectedRoles: any = [
    { id: 1, name: 'ROLE_USER', tag: 'User' },
    { id: 2, name: 'ROLE_MODERATOR', tag: 'Moderator' },
    {id:3,name:'ROLE_ADMIN',tag:'Admin'},
    {id:4,name:'ROLE_MASTER',tag:'Master'}
  ]
  page = 1
  count = 0
  pageSize = 10
  updateSubmitted=false
  roles: any[] = []
  users: any[] = []
  totalAccounts = 0
  showUserPanel = false
  display = 'none'
  isSearched=false
  displayNumber=8
  displayItems(number:number){
    let data={
      username:this.username,
      pageSize:number
    }
    this.userService.getUsers(data).subscribe((res) => {
      this.totalAccounts = res.data.users.totalUsers
      this.count = res.data.users.totalUsers
      this.page=res.data.users.currentPage
      this.users = res.data.users.users?.map((user: any) => {
        return { ...user, editable: this.checkRoleCondition(user) }
      })
    })
  }
  addUserPanel(){
   this.showUserPanel =!this.showUserPanel
  }
  getValueSelected(event: any) {
    this.roleSelected = event
  }
  getRequestParams(username: string, page: number, pageSize: number) {
    let params: any = {}
    if (username)
      params[`username`] = username
    params[`page`] = page - 1
    if (pageSize)
      params[`size`] = pageSize
    return params
  }
  checkMasterRole(role: any) {
    let hasMasterRole = false;
    role.forEach((x: any) => {
      if (x.name ==roleName.ma)
        hasMasterRole = true
    })
    return hasMasterRole
  }
  checkAdminRole(role: any) {
    let hasAdminRole = false
    role.forEach((x: any) => {
      if (x.name ===roleName.a)
        hasAdminRole = true
    })
    return hasAdminRole
  }

  checkModeratorRole(role: any) {
    let hasModeratorRole = false
    role.forEach((x: any) => {
      if (x.name === roleName.mo)
        hasModeratorRole = true
    })
    return hasModeratorRole
  }
  getPage(){
   const page= sessionStorage.getItem(Paging.PAGE_ADMIN_HOME)
   this.page=page?+page:1
   return this.page
  }
  getSearchParams(username:string,page:number){
    let params:any={}
   if(username)
   params[`username`]=username
   if(page)
   params[`page`]=page-1
    return params
  }
  eventSearch(){
    this.page=1
    this.searchUser()
  }
  searchUser(){
    this.isSearched=true
    let data={
      page:this.page-1,
      username:this.username,
      pageSize:this.pageSize,
    }
    this.userService.getUsers(data).subscribe((res:any)=>{
      this.users = res.data.users.users?.map((user: any) => {
        return { ...user, editable: this.checkRoleCondition(user) }
      })
      this.totalAccounts=res.data.users.totalUsers
      this.count=res.data.users.totalUsers
      this.page=res.data.users.currentPage+1
    })
  }
  getUsers() {
    this.userService.getUsers({}).subscribe((res) => {
      this.totalAccounts = res.data.users.totalUsers
      this.count = res.data.users.totalUsers
      this.users = res.data.users.users?.map((user: any) => {
        return { ...user, editable: this.checkRoleCondition(user) }
      })
    })
  }
  checkRoleCondition(user: any) {
    const hasRole = user.roles.some((r: any) => r.name === roleName.a || r.name === roleName.ma)
    if (this.currentUserRole == roleName.a && hasRole)
      return false;
    return true;
  }

  addRole(id: any) {
    if (this.checkRole(id)) {
      this.selectedUser.roles.push(this.roleSelected)
    }

  }
  checkRole(id: any) {
    const existRole = this.selectedUser.roles.find(role => role.id === id)
    return (this.selectedUser.roles
      && this.selectedUser.roles.length < 1
      && !existRole)
  }
  openModal() {
    this.display = "block"
  }
  onCloseHandled() {
    this.display = 'none'
    this.error=false
  }
  isOpened: boolean = false

  isOpen() {
    this.isOpened = !this.isOpened
  }
 
  
  getUserDetail(id: number) {
    return this.userService.getUser(id).subscribe((res) => {
      this.selectedUser = res
      let role=this.selectedRoles.find((role:any)=>role.id === res.roles[0].id)
      this.roleSelected={
        id:role.id,
        name:role.name
      }
      this.updateUserForm.patchValue({
        id:this.selectedUser.id,
        username:this.selectedUser.username,
        phone:this.selectedUser.phone,
        address:this.selectedUser.address,
        email:this.selectedUser.email,
        roles:[this.roleSelected]
      })
    })
  }

  deleteRole(index: any) {
    this.selectedUser.roles?.splice(index, 1)
  }
  userModal(id: number) {
   
    this.getUserDetail(id);
    this.openModal()
  }

changeRole(event:any){
  let role=this.selectedRoles.find((x:any)=>x.tag==event.target.value)
  this.roleSelected.id=role.id
  this.roleSelected.name=role.name
}
  updateUser(){
    const data = {
      user:{
      id: this.selectedUser.id,
      email: this.selectedUser.email,
      username: this.selectedUser.username,
      password: this.selectedUser.password,
      address:this.selectedUser.address,
      phone:this.selectedUser.phone,
      enabled:this.selectedUser.enabled,
      roles:[this.selectedUser.roles[0]]
      },
      roles:[this.roleSelected],
      email: this.updateUserForm.controls['email'].value,
      address:this.updateUserForm.controls['address'].value,
      phone:this.updateUserForm.controls['phone'].value
    }
    this.updateSubmitted=true
    if(this.updateUserForm.invalid){
      this.toastr.error('Error when updating, please check your input again!')
    }
    else {
      this.userService.updateUser(data).subscribe((res:any) => {
        this.display = 'none'
        this.toastr.info("User " + res.data.data.user.username+" is updated")
        this.updateError==''
        this.error=false
      },(error)=>{
          this.error=true
          this.updateError=error.error.errorMessage
          this.selectedUser==null
      })
    } 
  }
  showToast(username: string) {
    this.toastr.error(username+ ' has been deleted!')
  }
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe((res) => {
      this.selectedUser = this.users.find(user => user.id === id);
      this.users = this.users.filter(user => user.id != id)
      this.closeDeleteModal?.nativeElement.click()
      this.showToast(this.selectedUser.username)
    }, error => {
      this.toastr.warning("Cannot delete user! An error has occured", error.message)
    })
  }
  clearFilter(){
    this.isSearched=false
    this.username=null
  this.page=1
  this.pageSize=10
  this.searchUser()
   }
  handlePageChange(event: number): void {
    this.page = event
    sessionStorage.setItem(Paging.PAGE_ADMIN_HOME,JSON.stringify(event))
    this.searchUser()
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value
    this.page = this.page
    this.getUsers()
  }
}
