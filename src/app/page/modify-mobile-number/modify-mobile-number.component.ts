import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-modify-mobile-number',
  templateUrl: './modify-mobile-number.component.html',
  styleUrls: ['./modify-mobile-number.component.css']
})
export class ModifyMobileNumberComponent implements OnInit,OnDestroy {
  mobileNumber: string = "";
  Validation!: FormGroup;
  error: boolean = false;
  XORDecryptRes: any;
  dynValue: any;
  LinkMobileNumber: any = [];
  EnableFlag: String = "";
  somePlaceholder: String = "";
  buttonName: string = "";
  pattern: string = "";
  discoverBankResponse :any = [];
  constructor(private formBuilder: FormBuilder, private apiservice: BackendApiService, private router: Router, private storage: StorageServiceService) {
  }
  ngOnInit() {
    this.storage.setbackconflag(true);
    this.storage.setcrossconflag(false);
    this.EnableFlag = this.router.url == '/PanRequired' ? 'PAN' : this.router.url == '/Modifynumber' ? 'ModifyMobile' : this.router.url == '/Addmobile' ? 'AddMobile' : 'ModifyMobile';
    this.somePlaceholder = this.router.url == '/PanRequired' ? 'Enter PAN' : 'Enter mobile number';
    this.buttonName = this.router.url == '/PanRequired' ? 'Discover account' : 'Verify number';
    this.pattern = this.router.url == '/PanRequired' ? '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}' : '[0-9]{10}';
    this.Validation = this.formBuilder.group({
      Number: ['', [Validators.required, Validators.pattern(this.pattern)]]
    });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });
    if (this.EnableFlag != 'PAN') {
      let data = {
        I_MOBILENUMBER: this.XORDecryptRes?.mobile,
        I_BROWSER: "chrome",
        I_SESSION: this.XORDecryptRes?.sessionid,
        I_USERID: this.XORDecryptRes?.mobile,
        I_ConsentHandle: this.dynValue
      }

      this.apiservice.getMobileNumber(data).subscribe((res: any) => {
        this.LinkMobileNumber = !!res.lst ? res.lst : [];
      })
    }
  }

  NumberValidation(event: any) {
    let valueLength = this.Validation.value.Number.length;
    if (this.EnableFlag == 'PAN') {
      if ((valueLength < 5 && /^[a-zA-Z]+$/.test(event.key))) {
        return true;
      } else if ((valueLength >= 5 && valueLength < 9 && /^\d+$/.test(event.key))) {
        return true;
      } else if (valueLength === 9 && /^[a-zA-Z]+$/.test(event.key)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    } else {
      if ((valueLength <= 10 && /^\d+$/.test(event.key))) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  }
  handleClick() {
    this.mobileNumber = this.Validation.value.Number;
    if (this.EnableFlag == 'PAN') {
      this.XORDecryptRes.pan = this.mobileNumber.toUpperCase();
      this.storage.updateDecrypt(this.XORDecryptRes);
      if(this.discoverBankResponse.length > 0 ){
        this.router.navigate(["userBank"]);
      }else{
        this.router.navigate(["discoverloader"]);
      }
    } else {
      let result: any = [];
      if(this.LinkMobileNumber.length>0){
        result = this.LinkMobileNumber?.filter((val: any, index: number) => val?.MobileNumber === this.mobileNumber);
      }
      if (result.length > 0) {
        this.XORDecryptRes.mobile = this.mobileNumber;
        this.storage.updateDecrypt(this.XORDecryptRes);
        let redirection = this.discoverBankResponse.filter((x:any)=> x.FIPACCTYPE == 'Not_found').length == this.discoverBankResponse.length;
        if(!redirection){
          this.router.navigate(["userBank"]);
        }else{
          this.router.navigate(["discoverloader"]);
        }
      } else {
        this.router.navigate([`Verifyotp`],
          { queryParams: { 'mobilenumber': this.mobileNumber, 'newuser': 'true' } })
      }
    }
  }

  ngOnDestroy() {
    this.storage.setbackconflag(false);
  }
}
