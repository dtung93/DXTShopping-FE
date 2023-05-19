import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService{
apiURL = 'http://localhost:8080/api/cart/'
  constructor(private http:HttpClient) { 
}
public cart:any
getCart():Observable<any>{
  return this.http.get(this.apiURL+'get-cart')
  }
  addToCart(params:any):Observable<any>{
  return this.http.post(this.apiURL+`add-item`,params)
  }
  addToCartByQuantity(params:any):Observable<any>{
  return this.http.post(this.apiURL+'add-item-quantity',params)
  }
  removeFromCartByOne(params:any):Observable<any>{
    return this.http.post(this.apiURL+'remove',params)
  }
  deleteFromCart(data:any):Observable<any>{
    return this.http.post(this.apiURL+'remove-item',data)
  }
  emptyCart():Observable<any>{
    return this.http.delete(this.apiURL+'empty-cart')
  }
 setItemQuantity(data:any):Observable<any>{
   return this.http.post(this.apiURL+'set-item-quantity',data)
 }
 updateCartTotal(total:any){
  document.querySelector('#cart-total')!.innerHTML = total;
 }
}
