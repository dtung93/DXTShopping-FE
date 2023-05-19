import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
const apiURL="http://localhost:8080/api"
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getProducts(params:any): Observable<any> {
    return this.http.post(apiURL + '/products', params);
  }
 listproducts():Observable<any>{
   return this.http.get(apiURL+'/products')
 }
 getProductDetail(id:any):Observable<Product>{
   return this.http.get<Product>(apiURL + `/product/${id}`)
 }
 deleteProduct(id:any):Observable<void>{
   return this.http.delete<void>(`${apiURL}/delete/${id}`)
 }
 addProduct(data:any):Observable<Product>{
   return this.http.post<Product>(apiURL+ '/product/add',data)
 }
 updateProduct(data:any):Observable<Product>{
   return this.http.put<Product>(apiURL+'/product/update',data)
 }
 sortProduct(params:any): Observable<any> {
  return this.http.get(apiURL + '/products/sort-by-price', { params });
}
 
  constructor(private http:HttpClient) { }
}
