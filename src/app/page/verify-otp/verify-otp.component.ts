import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { CountdownComponent } from 'ngx-countdown';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit,OnDestroy {
  XORDecryptRes: any;
  otpmessage : any;
  otp : any = 0;
  disableresend = 0 ;
  activeCategory : string = 'BANK';
  loader : boolean = false;
  secondary_number : string = "";
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent | any;
  resendbtn : boolean = false;
  dynValue: any;
  discoverBankResponse : any =[];
  constructor(private apiservice: BackendApiService,private route: ActivatedRoute, private router: Router, private storage: StorageServiceService) {
  }

  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: ''
  };

  ngOnInit() {
    this.storage.setbackconflag(true);
    this.route.queryParams.subscribe(params => {
      this.secondary_number = !!params['mobilenumber'] ? params['mobilenumber'] :'';
  });
  this.storage.getdynData.subscribe(res => {
    this.dynValue = res;
  });
  this.storage.getdiscoverBankResponse.subscribe(res => {
    this.discoverBankResponse = res;
  });
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    if(!!this.secondary_number){
      this.generateOtp();
    }else{
      this.triggerOtp()
    }
  }
  onOtpChange(event: any) {
    this.otp = event.length;
    if (event.length == 6) {
      this.ngOtpInputRef.otpForm.disable();
      if(!!this.secondary_number){
        this.NewNumberverifyotp(event);
      }else{
        this.verifyotp(event);
      }
    }
  }


  triggerOtp() {
    let payload = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_CLIENTIP: '116.50.59.201',
      I_BROWSER: 'chrome',
      I_MPIN: '123456',
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }
    this.apiservice.triggerotp(payload).subscribe((res: any) => {
    })
  }

  generateOtp() {
    let payload = {
      I_SECONDARY_MOBILE_NUMBER:this.secondary_number,
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }
    this.apiservice.generateotp(payload).subscribe((res: any) => {
    })
  }

  NewNumberverifyotp(otp : any){
    this.loader = true;
    let payload = { I_MOBILENUMBER: this.XORDecryptRes.mobile, I_SECONDARY_MOBILE_NUMBER:this.secondary_number, I_MOBOTP: otp, I_BROWSER: 'chrome', I_SESSION: this.XORDecryptRes.sessionid, I_Flag: 'M', I_USERID: this.XORDecryptRes.mobile, I_ConsentHandle: this.dynValue };
    this.apiservice.NewnumberVerifyotp(payload).subscribe((res: any) => {
      this.loader = false;
      this.ngOtpInputRef.otpForm.enable();
      if (res.RESULT_CODE === '200') {
        this.XORDecryptRes.SecondarymobileNumber = this.secondary_number;
        this.storage.updateDecrypt(this.XORDecryptRes);
        this.getConcentHandelDetails();
      }else{
        this.otpmessage = "You have entered incorrect OTP!";
        this.ngOtpInputRef.setValue('');
        let eleId=this.ngOtpInputRef.getBoxId(0);
        this.ngOtpInputRef.focusTo(eleId);
        setTimeout(() => {
          this.otpmessage = '';
         }, 2000);
      }
    },err =>{
      this.loader = false;
      this.ngOtpInputRef.otpForm.enable();
    })
  }

  verifyotp(otp: any) {
    this.loader = true;
    let payload = { I_MOBILENUMBER: this.XORDecryptRes.mobile, I_MOBOTP: otp, I_BROWSER: 'chrome', I_CLIENTIP: '116.50.59.201', I_Flag: 'M', I_USERID: this.XORDecryptRes.mobile, I_ConsentHandle: this.dynValue };
    this.apiservice.Verifyotp(payload).subscribe((res: any) => {
      this.loader = false;
      this.ngOtpInputRef.otpForm.enable();
      if (res.RESULT_CODE === '200') {
        this.XORDecryptRes.sessionid = res.SESSION_ID;
        this.storage.updateDecrypt(this.XORDecryptRes);
        this.getConcentHandelDetails();
      }else if(res.RESULT_CODE === '400'){
        this.disableresend = 3; 
        this.otpmessage = "Account Locked , Try again after 30 minutes";
        this.ngOtpInputRef.setValue('');
        let eleId=this.ngOtpInputRef.getBoxId(0);
        this.ngOtpInputRef.focusTo(eleId);
      }else{
        this.otpmessage = "You have entered incorrect OTP!";
        this.ngOtpInputRef.setValue('');
        let eleId=this.ngOtpInputRef.getBoxId(0);
        this.ngOtpInputRef.focusTo(eleId);
        setTimeout(() => {
          this.otpmessage = '';
         }, 2000);
      }
    },err =>{
      this.loader = false;
      this.ngOtpInputRef.otpForm.enable();
    })
  }

  onTimerFinished(e:any){
    if (e["action"] == "done"){
      this.resendbtn = true;
     }
   }

   resendotp(){
    this.resendbtn = false;
    this.disableresend = this.disableresend+1;
    this.otpmessage = '';
    this.ngOtpInputRef.setValue('');
    let eleId=this.ngOtpInputRef.getBoxId(0);
    this.ngOtpInputRef.focusTo(eleId);
    if(!!this.secondary_number){
      this.generateOtp();
    }else{
      this.triggerOtp()
    }
  }

  getConcentHandelDetails(){
    let getConcentHandelPayload = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_ConsentHandle: this.dynValue,
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
    }
    this.apiservice.getConcentHandelDetails(getConcentHandelPayload).subscribe((res :any) => {
      if(typeof(this.XORDecryptRes.srcref) === 'object'){
        this.XORDecryptRes.srcref.map((val : any, index: number) => {
          const newValue = val.split('|');
           res.lst.filter((x:any)=>{
             if(x.CONSENTHANDLE == newValue[2]){
              x['required'] = newValue[1];
             }
          })
        })
      }else{
        res.lst[0]['required'] = 'Y'
      }
      let string = "";
      res.lst.forEach((item:any)=>{
        string = !!string ? string + ','+ item.FITYPES:item.FITYPES;
      })
      this.XORDecryptRes.fIType = string;
      this.storage.updateDecrypt(this.XORDecryptRes);
      this.storage.CONSENT_DETAILS(res?.lst);
      this.getFicategory();
    })
  }

  getFicategory(){
    let payload= {
      I_BROWSER: "chrome",
      I_FIPTYPES: this.XORDecryptRes.fIType.split(','),
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_SESSION: this.XORDecryptRes.sessionid,
    }
    this.apiservice.getFicategory(payload).subscribe((res:any) =>{
      if(res.RESULT_CODE == '200'){   
      let discoveredCategories =  res.FICategories?.reduce((acc:any, curr:any) => {
        if (!acc.find((cat:any) => cat === curr.FI_CATEGORY)) {
          acc.push(curr.FI_CATEGORY);
        }
        return acc;
      }, []);
      this.storage.Set_Currentfipcatergory(discoveredCategories[0]);
      this.activeCategory = discoveredCategories[0];
      this.storage.Set_fipcatergory(discoveredCategories);
      }
      if(!!this.XORDecryptRes.fipid){
        let redirection = this.discoverBankResponse.filter((x:any)=> x.FIPACCTYPE == 'Not_found').length == this.discoverBankResponse.length;
        if(!redirection){
          this.router.navigate(["userBank"]);
        }else{
          this.router.navigate(["discoverloader"]);
        }
        this.router.navigate(['discoverloader']);
      }else{
        this.getFipDetails();
      }
    })
  }

  getFipDetails(){
    const bankListRequestBody = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_MPIN: '111111',
      I_BROWSER: 'chrome',
      I_asset_class_id:
      this.activeCategory === 'BANK'
        ? 'BANK'
        : this.activeCategory === 'MF'
          ? 'MF_ETF_OTHERS'
          : this.activeCategory === 'NPS'
            ? 'NPS'
            : this.activeCategory === 'EQUITIES'
              ? 'EQUITIES'
              : this.activeCategory === 'INSURANCE_POLICIES'
                ? 'INSURANCE'
                : 'GSTR',
      I_SEARCHKEY: '',
      I_SESSION: this.XORDecryptRes.sessionid,
      I_ConsentHandle: this.dynValue,
      I_SEARCHPAGENATION: 'All',
    };
  
    this.apiservice.SearchFip(bankListRequestBody).subscribe((res :any) => {
      if(res.RESULT_CODE == 200){
        this.storage.Update_fip(res.lst);
        if(this.activeCategory === 'BANK' || this.activeCategory === 'INSURANCE_POLICIES'){
          this.router.navigate(['ChooseBank']);
        }else{
          let discoverFIpid :any=[];
          res.lst.filter((x:any)=>{
              discoverFIpid.push(x.FIPID);
          })
            this.XORDecryptRes.fipid = discoverFIpid.toString();
            this.storage.updateDecrypt(this.XORDecryptRes);
            this.router.navigate(['discoverloader']);
        }
      }
    })
  
  }
  ngOnDestroy() {
    this.storage.setbackconflag(false);
  }
}
