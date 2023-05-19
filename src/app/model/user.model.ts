import { isConstructorDeclaration } from "typescript";

export class User{
  id!: number;
 username!: string 
 password!:string
 email!:string
 address!:string
 cart!:any
 avatar!:string
 phone!:number
 roles:any[]=[]
 enabled!:boolean
}

