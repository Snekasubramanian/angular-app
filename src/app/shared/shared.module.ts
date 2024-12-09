import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { BankListComponent } from './component/bank-list/bank-list.component';
import { VerifybankOtpComponent } from './component/verifybank-otp/verifybank-otp.component';
import { ConsentDrawerComponent } from './component/consent-drawer/consent-drawer.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { CountdownModule } from 'ngx-countdown';
import { FixdrawerComponent } from './component/fixdrawer/fixdrawer.component';
import { DenyandExitComponent } from './component/denyand-exit/denyand-exit.component';
import { ListAvailableComponent } from './component/list-available/list-available.component';

@NgModule({
  declarations: [BankListComponent,VerifybankOtpComponent, ConsentDrawerComponent,FixdrawerComponent,DenyandExitComponent, ListAvailableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    NgOtpInputModule,
    CountdownModule
  ],
  exports: [
    BankListComponent,
    MaterialModule
  ],
  providers: [],
//   entryComponents: [],
  schemas: []
})
export class SharedModule { }