import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { authInterceptorProviders } from './service/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FooterComponent } from './footer/footer.component';
import { FileUpLoadComponent } from './file-up-load/file-up-load.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BoardMasterComponent } from './board-master/board-master.component';
import { ForgotpasswordComponent } from './forgot-password/forgotpassword.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifiedAccountComponent } from './verified-account/verified-account.component';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrdersComponent } from './orders/orders.component';
import { AuthGuardService } from './service/auth-guard.service';
import { OrderFormComponent } from './order-form/order-form.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { SpinnerService } from './service/spinner.service';
import { LoaderInterceptorService } from './service/interceptors/loader-interceptor.service';
import { SliderComponent } from './slider/slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    ProductDetailComponent,
    FooterComponent,
    FileUpLoadComponent,
    BoardMasterComponent,
    ForgotpasswordComponent,
    ResetPasswordComponent,
    VerifiedAccountComponent,
    CartComponent,
    OrderDetailsComponent,
    OrdersComponent,
    OrderFormComponent,
    HeaderComponent,
    LoaderComponent,
    SliderComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgHttpLoaderModule.forRoot(),
    ToastrModule.forRoot({
      timeOut:3000,preventDuplicates:true,
      positionClass: 'toast-bottom-right'
   })
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [authInterceptorProviders,AuthGuardService,SpinnerService,{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
