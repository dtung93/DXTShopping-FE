import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
 order:any
 items:any[]=[]
  constructor(private route:ActivatedRoute,private orderService:OrderService) { }

  ngOnInit(): void {
    this.getOrderDetails(this.route.snapshot.params['id'])
  }
 
  getOrderDetails(id:number) {
    return this.orderService.getOrderDetails(id).subscribe((res)=>{
        this.order=res
        this.items=res.cart.items
        console.log(this.order)
        console.log(res)
    })
  }
}
