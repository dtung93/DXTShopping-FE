import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../model/product.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { TokenStorageService } from '../service/token-storage.service';
import { CartService } from '../service/cart.service';
import { User } from '../model/user.model';
import { lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
product=new Product()
productForm:FormGroup
username:any
name:string=''
  constructor(private fb:FormBuilder,private cartService:CartService,private toastr:ToastrService, private api:ProductService,private route:ActivatedRoute,private token:TokenStorageService) { 
    this.productForm=this.fb.group({
      id:[null],
      name:['',[Validators.required]],
      img:[''],
      description:[''],
      category:['',[Validators.required]],
      price:[null,[Validators.required]],
      qty:[null,[Validators.required]],
      date:[],
      editBy:[]
    })
  }
  ngOnInit(): void {
   this.getProduct(this.route.snapshot.params['id'])
    if(this.token.getToken()){
      this.roles=this.token.getUser().roles
     if(this.roles.includes("ROLE_MODERATOR")&&this.token.getUser().enabled||this.roles.includes("ROLE_ADMIN")&&this.token.getUser().enabled||this.roles.includes('ROLE_MASTER')&&this.token.getUser().enabled){
       this.showButton=true
       console.log(this.productForm)
     }
     else{
       this.showButton=false
       if(this.token.getUser().enabled){ 
         this.showCart=true
      }
   }
    }
  }
  showToast(id:any){
    this.toastr.info('Product'+' '+'#'+id+' is updated')
  }

  font='font-family:optima'
  padding='padding:5'
  info='background-color:#2d8bca ;margin:10px 15px 10px 5px;text-align:center;color:snow;font-size:25px'
  title='color:#638BA6;font-size:3rem;font-weight:bold'
  category='color:#A95C68;font-size:1rem'
  description='color:grey;font-weight:bold;font-size:15px;text-align:left'
  price='color:smoke;font-weight:bolder;font-size:2rem'
  edit='color:white;font-size:20px;width:100%;background-color:#318dca'
  addtocart='color:white;font-size:20px;width:100%;background-color:#239beb;'
  width='width:100%'
  isLoggedIn=false
  showButton=false
  nameError=false
  quantityError=false
  priceError=false
  showCart=false
  smallStock=false
  outOfStock=false
  roles:string[]=[]
 
getProduct(id:number){
  this.api.getProductDetail(id).subscribe((s)=>{
    this.product=s
    this.productForm.patchValue({
      id:s.id,
     name:s.name,
     img:s.img,
     description:s.description,
     qty:s.qty,
     price:s.price,
     category:s.category,
     editBy:this.roles[0].substring(5,14)+" "+this.token.getUser().username,
     date:new Date(),
    })
    if(this.product.qty<=5){
      this.smallStock=true
    }
    if(this.product.qty==0){
      this.outOfStock=true
    }

   
  })
}
display='none'
openModal(){
  this.display="block"
}
onCloseHandled(){
  this.display='none'
}
isOpened: boolean=false
isOpen(){
  this.isOpened=!this.isOpened
}



updateProduct():void{

if(this.productForm.invalid){
  this.toastr.error('Error! Please check your input fields again')
}
else{
  this.api.updateProduct(this.productForm.value).subscribe((res)=>{
    this.display='none'
    this.nameError=false
    this.quantityError=false
    this.priceError=false
  })
this.toastr.info(this.productForm.get('name')?.value.toString()+' successfully updated')
}
}

addProductToCart(){
  if(!this.token.getToken()){
    this.toastr.error('Please sign in to use this service')
  }
  else{
    const productId={id:this.product.id}
    const productName=this.product.name
  this.cartService.addToCart(productId).subscribe((res)=>{
    this.cartService.updateCartTotal(res.totalItems)
    this.toastr.info(productName+' added to cart')
  })
  }
}
}
