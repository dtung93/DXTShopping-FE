export interface OrderDetail{
Id:string,
dateCreated:Date,
name:string,
address:string,
phone:string
status:string,
orderItems:[],
totalItems:number,
grandTotal:number
}