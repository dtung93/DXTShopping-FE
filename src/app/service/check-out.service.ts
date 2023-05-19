import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {
 apiURL="http://localhost:8080/api/payment/"
  constructor(private http:HttpClient) { }
checkout(data:any){
  return this.http.post(this.apiURL+'charge',data)
}
}
