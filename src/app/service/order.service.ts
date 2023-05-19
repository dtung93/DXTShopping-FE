import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
apiURL="http://localhost:8080/api/order/"
  constructor(private http:HttpClient) { }
getAllOrders(data:any):Observable<any>{
  return this.http.post(this.apiURL+'all-orders',data)
}
getOrderDetails(id:number):Observable<any>{
  return this.http.get(this.apiURL+`details/${id}`)
}
getOrder(data:any):Observable<any>{
  return this.http.post(this.apiURL+'my-order',data)
}
newOrder(data:any):Observable<any>{
return this.http.post(this.apiURL+'new-order',data)
}

}
