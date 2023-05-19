import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-board-moderator',
  templateUrl: './board-moderator.component.html',
  styleUrls: ['./board-moderator.component.scss']
})
export class BoardModeratorComponent implements OnInit {
  width='width:100%'
  isSubmitted=false
  display= 'none'
  addedProductId:any
  content?:string
  categories:any=[
    {name:'Shoes'},{name:'Cars'},{name:'Health'},
    {name:'Computers'},{name:'Garden'},{name:'Beauty'},
    {name:'Home'},{name:'Clothing'},{name:'Sports'},{name:'Grocery'},{name:"Kids"},{name:"Automotive"},{name:"Toys"},
    {name:'Movies'},{name:'Grocery'}
    ]
  
  productForm:FormGroup
  productPanel=false
  openProductPanel(){
    this.productPanel=!this.productPanel
  }
  constructor(private userService:UserService,private fb:FormBuilder,private api:ProductService,private toastr:ToastrService) {  this.productForm=this.fb.group({
    name:['',[Validators.required,Validators.minLength(4),Validators.maxLength(25)]],
    img:[''],
    category:['',[Validators.required]],
    description:['',[Validators.required]],
    price:['',[Validators.required]],
    qty:['']
    }) }
    showToast(id:number,name:string){
    this.toastr.success(
      "Product id="+id+" "+name+" is succesfully added to the inventory"
    )
    }
    openModal(){
      this.display='block'
    }
    closeModal(){
      this.display='none'
    }
    submitSuccess(id:number,name:string,){
      this.display='none'
      this.showToast(id,name)
      setInterval(()=>{window.location.reload()},2000)
    }
    submitForm(){
      this.isSubmitted=true
      if(this.productForm.valid){
      const data=this.productForm.value
      return this.api.addProduct(data).subscribe((res)=>{
       this.submitSuccess(res.id,res.name)     
      },error=>console.log(error.message))
     }
     else{
     return this.toastr.error('Failed to add product','Please check the fields again')
     }}
  ngOnInit(): void {
    this.userService.getModeratorBoard().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }

}
