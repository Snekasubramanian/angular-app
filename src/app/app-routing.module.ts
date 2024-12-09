import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadingpageComponent } from './page/loadingpage/loadingpage.component';
import { VerifyOtpComponent } from './page/verify-otp/verify-otp.component';
import { DiscoverloaderComponent } from './page/discoverloader/discoverloader.component';
import { BankPageComponent } from './page/bank-page/bank-page.component';
import { WarningPageComponent } from './page/warning-page/warning-page.component';
import { ModifyMobileNumberComponent } from './page/modify-mobile-number/modify-mobile-number.component';
import { ChooseBankComponent } from './page/choose-bank/choose-bank.component';
import { LottieLoaderComponent } from './page/lottie-loader/lottie-loader.component';
import { InformationComponent } from './page/information/information.component';
const routes: Routes = [
  {
    path:'',
    component:LoadingpageComponent
  },
  {
    path:'Verifyotp',
    component:VerifyOtpComponent
  },
  {
    path:'discoverloader',
    component:DiscoverloaderComponent
  },
  {
    path:'userBank',
    component:BankPageComponent
  },
  {
    path:'warningPage',
    component:WarningPageComponent
  },
  {
    path:'Modifynumber',
    component:ModifyMobileNumberComponent
  },
  {
    path:'Addmobile',
    component:ModifyMobileNumberComponent
  },
  {
    path:'PanRequired',
    component:ModifyMobileNumberComponent
  },
  {
    path:'ChooseBank',
    component:ChooseBankComponent
  },
  {
    path:'lottie',
    component:LottieLoaderComponent
  },
  {
    path:'information',
    component:InformationComponent
  },
  {
    path:'Remindlater',
    component:InformationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
