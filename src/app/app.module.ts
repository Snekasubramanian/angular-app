import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './page/header/header.component';
import { LoadingpageComponent } from './page/loadingpage/loadingpage.component';
import { FooterComponent } from './page/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorInterceptor } from './http-interceptor.interceptor';
import { VerifyOtpComponent } from './page/verify-otp/verify-otp.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { StorageServiceService } from './services/storage-service.service';
import { DiscoverloaderComponent } from './page/discoverloader/discoverloader.component';
import { CountdownModule } from 'ngx-countdown';
import { BankPageComponent } from './page/bank-page/bank-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared/shared.module';
import { WarningPageComponent } from './page/warning-page/warning-page.component';
import { ModifyMobileNumberComponent } from './page/modify-mobile-number/modify-mobile-number.component';
import { ChooseBankComponent } from './page/choose-bank/choose-bank.component';
import { LottieLoaderComponent } from './page/lottie-loader/lottie-loader.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InformationComponent } from './page/information/information.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoadingpageComponent,
    FooterComponent,
    VerifyOtpComponent,
    DiscoverloaderComponent,
    BankPageComponent,
    WarningPageComponent,
    ModifyMobileNumberComponent,
    ChooseBankComponent,
    LottieLoaderComponent,
    InformationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgOtpInputModule,
    CountdownModule,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [StorageServiceService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
