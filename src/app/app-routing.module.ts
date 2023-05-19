import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BoardMasterComponent } from './board-master/board-master.component';
import { FileUpLoadComponent } from './file-up-load/file-up-load.component';
import {ForgotpasswordComponent} from './forgot-password/forgotpassword.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifiedAccountComponent } from './verified-account/verified-account.component';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { AuthGuardService } from './service/auth-guard.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrdersComponent } from './orders/orders.component';
import { SliderComponent } from './slider/slider.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[AuthGuardService] },
  { path: 'mod', component: BoardModeratorComponent,canActivate:[AuthGuardService] },
  { path: 'admin', component: BoardAdminComponent,canActivate:[AuthGuardService] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path:'product/:id',component:ProductDetailComponent},
  {path:'cart',component:CartComponent,canActivate:[AuthGuardService]},
  {path:'order-details/:id',component:OrderDetailsComponent},
  {path:'master',component:BoardMasterComponent},
  {path:'file-upload',component:FileUpLoadComponent},
  {path:'forgot-password',component:ForgotpasswordComponent},
  {path:'reset-password',component:ResetPasswordComponent},
  {path:'verified-account',component:VerifiedAccountComponent},
  {path:'order-form',component:OrderFormComponent},
  {path:'my-orders',component:OrdersComponent,canActivate:[AuthGuardService]},
  {path:'slider',component:SliderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
