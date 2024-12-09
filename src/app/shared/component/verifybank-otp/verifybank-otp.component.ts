import { Component, Inject, ViewChild } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { CountdownComponent } from 'ngx-countdown';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-verifybank-otp',
  templateUrl: './verifybank-otp.component.html',
  styleUrls: ['./verifybank-otp.component.css']
})
export class VerifybankOtpComponent {
  XORDecryptRes: any;
  otpmessage : any;
  resendbtn : boolean = false;
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent | any;
  toLinkBank:any = [];
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputClass:'each_input'
  };
  dynValue: any=[];
  RefNumber: string="";
  shimmer : boolean = true;
  discoverBankResponse: any=[];
  loader : boolean = false;
  otp : string = "";
  constructor(private _bottomSheetRef: MatBottomSheetRef<VerifybankOtpComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private storage: StorageServiceService,private apiservice: BackendApiService) {

   }

   
  ngOnInit() {
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.Linkconsent(this.data,'Initial');

  }
  onOtpChange(event: any) {
    this.otp = event;
    if (event.length == 6) {
      this.ngOtpInputRef.otpForm.disable();
      this.authenticateToken(event);
    }
  }

  authenticateToken(otp:any){
    this.loader = true;
    let payload = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_FIPID: this.toLinkBank[0].FIPID,
      I_FIPACCREFNUM: this.RefNumber,
      I_MOBOTP: otp,
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }
    this.apiservice.AuthenticateToken(payload).subscribe((decryptedResponse:any)=>{
      this.loader = false;
      if (decryptedResponse.RESULT_CODE === '200') {
        this.ngOtpInputRef.otpForm.enable();
        const updated = this.discoverBankResponse.map((acc: any, index: any) => {
          decryptedResponse.fip_NewDiscoverelist.map((x: any) => {
            if (x.FIPACCREFNUM === acc.FIPACCREFNUM) {
              this.discoverBankResponse[index].Linked = true;
              this.discoverBankResponse[index].LINKEDDATE = x.LINKEDDATE;
              this.discoverBankResponse[index].FIPACCLINKREF = x.FIPACCLINKREF
              return false;
            }
            return x;
          })
          return acc;
        })
        this.storage.updatediscover(updated);
        this._bottomSheetRef.dismiss();
      }else{
        this.otpmessage = "You have entered incorrect OTP!";
        this.ngOtpInputRef.setValue('');
        let eleId=this.ngOtpInputRef.getBoxId(0);
        this.ngOtpInputRef.focusTo(eleId);
        this.ngOtpInputRef.otpForm.enable();
        setTimeout(() => {
          this.otpmessage = '';
         }, 2000);
      }
    },err=>{
      this.loader = false;
      this.ngOtpInputRef.otpForm.enable();
    })
  }

  resendotp(){
    this.resendbtn = false;
    this.otpmessage = '';
    this.ngOtpInputRef.setValue('');
    let eleId=this.ngOtpInputRef.getBoxId(0);
    this.ngOtpInputRef.focusTo(eleId);
    this.Linkconsent(this.data,'resend');
  }
  
  onTimerFinished(e:any){
    if (e["action"] == "done"){
      this.resendbtn = true;
     }
   }
   disable(){
    return this.otp.length == 6 ? false : true;
   }
   Linkconsent(list:any,flag:string){
    this.shimmer = flag=='resend'?false:true;
    this.toLinkBank = [];
    list.forEach((item: any) => {
      if (item.Consent === false && item.Linked === false && item.isChecked) {
        const data = {
          FIPACCNUM: item.FIPACCNUM,
          FIPACCREFNUM: item.FIPACCREFNUM,
          FIPACCTYPE: item.FIPACCTYPE,
          FIPTYPE: item.FITYPE,
          FIPID: item.FIPID,
          Logo: item.Logo
        }
        this.toLinkBank.push({ ...data })
      }
    })
    const inputBankpayload = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_BROWSER: 'Chrome',
      I_FIPID: this.toLinkBank[0].FIPID,
      ACCOUNTS_TO_LINK: this.toLinkBank,
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }
    this.apiservice.linkConsent(inputBankpayload).subscribe((res:any)=>{
      this.shimmer = false;
      if (res?.RESULT_CODE === '200') {
        this.RefNumber = res?.RefNumber ?? '';
      }
    },err=>{
      this.shimmer = false;
    })
  }
}
