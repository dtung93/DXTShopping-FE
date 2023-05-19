import { Component, OnInit } from '@angular/core';
import { roleName } from '../model/role.model';
import { OrderService } from '../service/order.service';
import { TokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  isSearched=false
  username:any
  sortValue:any
  page = 1
  pageSize = 10
  totalItems=0
  roles: any[] = []
  isAdmin = false
  sort = ''
  constructor(private token: TokenStorageService, private orderService: OrderService) { }
  orders: any[] = []
  ngOnInit(): void {
    if (this.token.getToken()) {
      this.roles = this.token.getUser().roles;
      if (this.roles.includes(roleName.u)) {
        this.getMyOrder()
      }
      else {
        this.isAdmin = true
        this.getAllOrders()
      }
    }
  }
  sortOptions = [
    { id: 1, name: 'Sort by lowest total', value: 'asc',isSelected: false  },
    { id: 2, name: 'Sort by highest total', value: 'desc',isSelected: false  }
  ]
  sortedOptions(item:any) {
    this.sortValue = this.sortOptions.find(x => x.value == item.value)?.value
    this.sortOptions.forEach((option)=>{
      if(option.id==item.id)
    option.isSelected=!option.isSelected
    else{
      option.isSelected=false
    }
    })
    console.log(this.sortValue)
  }
  displayUsers(sort:number){
  this.pageSize=sort
  this.page=1
  this.searchOrders()
  }
  getAllOrders() {
    const data = {
      page: this.page-1,
      pageSzie: this.pageSize
    }
  this.searchOrders()
  }
  searchOrders(){

    const data={
    username:this.username,
    page:this.page-1,
    pageSize:this.pageSize,
    sort:this.sortValue
    }
    this.orderService.getAllOrders(data).subscribe((res)=>{
      this.orders=res.data.response.orders
      this.page=res.data.response.currentPage+1
      this.totalItems=res.data.response.totalItems
    })
  }
  eventSearch(){
    this.page=1
    this.isSearched=true
    this.searchOrders()
  }
  getMyOrder() {
    const data = {
      page: this.page-1,
      pageSize: this.pageSize,
      sort: this.sort
    }
    this.orderService.getOrder(data).subscribe((res) => {
      this.orders = res.data.data.orders
      this.totalItems=res.data.totalItems
      this.page=res.data.currentPage+1
      console.log(this.orders)
    })
  }
  clearFilters(){
    this.username=null
  this.page=1
  this.pageSize=10
  this.sortValue=null
  this.isSearched=false
  this.searchOrders()
  }
  pageChange(event:any){
    this.page=event
    this.searchOrders()
  }
}
