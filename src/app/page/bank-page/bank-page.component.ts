import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { ConsentDrawerComponent } from 'src/app/shared/component/consent-drawer/consent-drawer.component';
import { ImportantComponent } from 'src/app/shared/component/important/important.component';

@Component({
  selector: 'app-bank-page',
  templateUrl: './bank-page.component.html',
  styleUrls: ['./bank-page.component.css']
})
export class BankPageComponent implements OnInit, OnDestroy {
  discoverBankResponse: any = [];
  bankDict: any = {};
  bankList: any = [];
  consentData: any = [];
  XORDecryptRes: any;
  loader: boolean = false;
  fetch: any = [];
  consentChecked: boolean = true;
  currentCategory: string = "";
  ConsentForm!: FormGroup;
  choosebanklist : any =[];
  dynValue : any
  FixFIPNAME : any = "";
  Fiplist: any =[];
  constructor(private formBuilder: FormBuilder, private router: Router, private apiservice: BackendApiService, private _bottomSheet: MatBottomSheet, private storage: StorageServiceService) { }


  ngOnInit() {
    this.storage.setcrossconflag(true);
    this.ConsentForm = this.formBuilder.group({}, { validators: this.atLeastOneValidator });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.storage.getFipdetails.subscribe(res => {
      this.choosebanklist = res;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });
    this.storage.getFipdetails.subscribe(res => {
        this.Fiplist = res;
    })
    this.storage.getFixFIPName.subscribe(res => {
      this.FixFIPNAME = res;
     }); 
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getconsentdetails.subscribe(res => {
      this.consentData = res;
      if (this.consentData.length > 0) {
        this.consentData.map((item: any) => {
          item.required == 'N' ? this.ConsentForm.addControl(item.CONSENTHANDLE, new FormControl(true)) : this.ConsentForm.addControl(item.CONSENTHANDLE, new FormControl(true, Validators.requiredTrue));
        })
      }
    })
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.currentCategory = res;
    });
    this.createFormat();
    let recoverAccount: any = [];
    recoverAccount = this.discoverBankResponse.filter((x: any) => !!x.PartialLoader && x.PartialLoader);
    if (recoverAccount.length > 0 && this.XORDecryptRes.fixFipid == '') {
      this.RecoverAccount(recoverAccount[0].FIPNAME)
    } else if (recoverAccount.length > 0 && !!this.XORDecryptRes.fixFipid) {
      this.Changefipanddiscover(recoverAccount[0].FIPNAME);
    }
  }

  createFormat(){
    this.bankList = [];
    this.bankDict = {};
    this.discoverBankResponse.forEach((item: any, index: any) => {
      if (this.currentCategory == 'GSTR') {
        if (!this.bankList.includes(item.Mobile)) {
          this.bankList.push(item.Mobile)
          this.bankDict[item.Mobile] = []
          this.bankDict[item.Mobile].push(item)
        } else {
          this.bankDict[item.Mobile].push(item)
        }
      } else {
        if (!this.bankList.includes(item.FIPID)) {
          this.bankList.push(item.FIPID)
          this.bankDict[item.FIPID] = []
          this.bankDict[item.FIPID].push(item)
        } else {
          this.bankDict[item.FIPID].push(item)
        }
      }
    })
  }

  RecoverAccount(FipName: any) {
    let fetch : any =[];
    let fip = this.choosebanklist.filter((val: any) => val.FIPNAME === FipName);
    const data = {
      I_MOBILENUMBER: this.XORDecryptRes.SecondarymobileNumber ? this.XORDecryptRes.SecondarymobileNumber : this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_Identifier: [
        {
          I_Flag: 'MOBILE',
          DATA: this.XORDecryptRes.SecondarymobileNumber ? this.XORDecryptRes.SecondarymobileNumber : this.XORDecryptRes.mobile,
          type: 'STRONG'
        },
        {
          I_Flag: 'PAN',
          DATA: this.XORDecryptRes.pan,
          type: 'WEAK',
        }],
      I_FITYPE: this.XORDecryptRes.fIType,
      I_FIPID: fip[0]?.FIPID,
      I_FIPNAME: '', // ASK
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }

    fetch.push(this.apiservice.discoverdata(data));
    
    Promise.all(fetch).then((responses)=>{
      let decryptedResponse = responses[0];
      if (decryptedResponse.AccountCount > 0) {
        let AlreadyhaveAccounts = this.discoverBankResponse.filter((val: any) => val.FIPNAME !== decryptedResponse.FIPName)
        decryptedResponse?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push(val));
        this.discoverBankResponse = AlreadyhaveAccounts;
        this.storage.updatediscover(AlreadyhaveAccounts);
    }else{
      this.discoverBankResponse.forEach((item:any)=>{
        if(item.PartialLoader){
          item.PartialLoader = false;
        }
      })
    }
    this.createFormat();
    })

  }

  Changefipanddiscover(FipName: any){
    let fetch : any =[];
    this.XORDecryptRes.fixFipid.split(',').map((fipId: any) => {
    const data = {
      I_MOBILENUMBER: this.XORDecryptRes.SecondarymobileNumber ? this.XORDecryptRes.SecondarymobileNumber : this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_Identifier: [
        {
          I_Flag: 'MOBILE',
          DATA: this.XORDecryptRes.SecondarymobileNumber ? this.XORDecryptRes.SecondarymobileNumber : this.XORDecryptRes.mobile,
          type: 'STRONG'
        },
        {
          I_Flag: 'PAN',
          DATA: this.XORDecryptRes.pan,
          type: 'WEAK',
        }],
      I_FITYPE: this.XORDecryptRes.fIType,
      I_FIPID: fipId,
      I_FIPNAME: '', // ASK
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }

    fetch.push(this.apiservice.discoverdata(data));
  });
    
    Promise.all(fetch).then((responses)=>{
      let MergeArray: any = [];
      let accountCount: number = 0;
      if (!!this.FixFIPNAME) {
        let AlreadyhaveAccounts: [] = this.discoverBankResponse.filter((val: any) => val.FIPNAME !== FipName);
        MergeArray = AlreadyhaveAccounts;
        accountCount = MergeArray.length;
      }
      responses.forEach(item => {
        if (!!item) {
          if (!!item.AccountCount && item.AccountCount > 0) {
            accountCount = accountCount + item.AccountCount;
            item.fip_DiscoverLinkedlist.map((val: any) => {
              val['PartialLoader'] = false;
              MergeArray.push(val);
            })
          } else if(item.AccountCount == undefined){
            MergeArray.push({
              "Consent": false,
              "Linked": true,
              "Id": "Not_found",
              "FIPID": item.I_FIPID,
              "AMCSHORTCODE": "Not_found",
              "FIPNAME":this.getFip(item.I_FIPID,'Fipname'),
              "FITYPE": "Not_found",
              "ACCDISCOVERYDATE": "Not_found",
              "FIPACCTYPE": "Not_found",
              "FIPACCREFNUM": "Not_found",
              "FIPACCNUM": "Not_found",
              "FIPACCLINKREF": "Not_found",
              "LINKEDDATE": "Not_found",
              "Logo": this.getFip(item.I_FIPID,'logo'),
              'PartialLoader':false
            })
          } else {
            MergeArray.push({
              "Consent": false,
              "Linked": true,
              "Id": "Not_found",
              "FIPID": this.getFip(item.FIPName,'fipid'),
              "AMCSHORTCODE": "Not_found",
              "FIPNAME": item.FIPName,
              "FITYPE": "Not_found",
              "ACCDISCOVERYDATE": "Not_found",
              "FIPACCTYPE": "Not_found",
              "FIPACCREFNUM": "Not_found",
              "FIPACCNUM": "Not_found",
              "FIPACCLINKREF": "Not_found",
              "LINKEDDATE": "Not_found",
              "Logo": item.Logo,
              'PartialLoader':false
            })
          }
        }
      })
      let Finalresult = MergeArray.reduce((unique: any, o: any) => {
        if (!unique.some((obj: any) => obj.FIPID === o.FIPID && obj.FIPNAME === o.FIPNAME && obj.FIPACCNUM === o.FIPACCNUM)) {
          o['isChecked'] = true;
          o['Mobile'] = this.XORDecryptRes.mobile;
          unique.push(o);
        }
        return unique;
      }, []);
      this.discoverBankResponse = Finalresult;
      this.storage.updatediscover(Finalresult);
      this.createFormat();
      this.XORDecryptRes.fixFipid = "";
      this.storage.updateDecrypt(this.XORDecryptRes);
    })
  }

  getFip(Name:any,fip:string){
    if(fip == 'Fipname'){
       let filtervalue =  this.Fiplist.filter((val: any) => val.FIPID === Name);
       return filtervalue.length > 0 ? filtervalue[0].FIPNAME : '';
     }else if(fip == 'logo'){
         let filtervalue =  this.Fiplist.filter((val: any) => val.FIPID === Name);
         return filtervalue.length > 0 ? filtervalue[0].LOGO : '';
     }else{
       let filtervalue =  this.Fiplist.filter((val: any) => val.FIPNAME === Name);
       return filtervalue.length > 0 ? filtervalue[0].FIPID : '';
     }
   }

  public atLeastOneValidator: any = (control: FormGroup): ValidationErrors | any => {
    let controls = control.controls;
    if (controls) {
      let theOne = Object.keys(controls).findIndex(key => controls[key].value == true);
      if (theOne === -1) {
        return {
          atLeastOneRequired: {
            text: 'At least one should be selected'
          }
        }
      }
    };

  }

  isDisabled(): boolean | any {
    if (this.discoverBankResponse.length > 0) {
      let FilterValidResponse = this.discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
      let isLinkedChecked = FilterValidResponse.filter((d: any) => d.isChecked && d.Linked).length;
      return (isLinkedChecked > 0 && this.ConsentForm.valid) ? false : true;
    }
  }
  consentclick() {
    this.consentChecked = !this.consentChecked;
    const keys = Object.keys(this.ConsentForm.controls);
    keys.forEach((key: string) => {
      this.ConsentForm.controls[key].setValue(this.consentChecked);
    });
  }

  openconsent() {
    let dialogRef = this._bottomSheet.open(ConsentDrawerComponent,
      {
        data: { consent: this.consentData, index: 0, form: this.ConsentForm },
        hasBackdrop: true,
        disableClose: true
      })
    dialogRef.afterDismissed().subscribe(result => {
      this.ConsentForm = result;
      this.consentChecked = this.ConsentForm.valid;
    });
  }

  EditPan() {
    this.router.navigate(["PanRequired"])
  }

  submit() {
    let FilterValidResponse = this.discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
    let isLinkedChecked = FilterValidResponse.filter((d: any) => d.isChecked && d.Linked).length;
    if (FilterValidResponse.length == isLinkedChecked) {
      this.submitconsent();
    } else {
      let dialogRef = this._bottomSheet.open(ImportantComponent, { hasBackdrop: true });
      dialogRef.afterDismissed().subscribe(result => {
        if (result == 'Submit') {
          this.submitconsent();
        }
      });
    }
  }

  submitconsent() {
    this.loader = true;
    const FIPDetailsListModified: any = [];
    let FilterValidResponse = this.discoverBankResponse.filter((d: any) => d.FIPACCREFNUM !== "Not_found");
    // To generate ConsentArtefact Payload
    FilterValidResponse.forEach((item: any) => {
      if (item.Linked && item.isChecked) {
        const temporaryDict = {
          CUSTID: this.XORDecryptRes.mobile,
          FIPID: item.FIPID,
          FIPACCREFNUM: item.FIPACCREFNUM,
          LINKEDDATE: item.LINKEDDATE ?? '',
          FIPACCTYPE: item.FIPACCTYPE,
          FIPACCNUM: item.FIPACCNUM,
          FITYPE: item.FITYPE,
          LOGO: item.Logo,
          FIPNAME: item.FIPNAME,
          FIPACCLINKREF: item.FIPACCLINKREF,
          LINKINGREFNUM: item.FIPACCLINKREF,
          isCardSelected: true,
          CONSENTDATE: new Date().toISOString(),
          CONSENTCOUNT: 1
        }
        FIPDetailsListModified.push(temporaryDict)
      }
    })

    this.consentData.forEach((val: any) => {
      const consentBody = {
        I_MOBILENUMBER: this.XORDecryptRes.mobile,
        I_MPIN: '111111',
        I_BROWSER: 'chrome',
        I_ConsentHandle: val.CONSENTHANDLE,
        FIPDetailsList: FIPDetailsListModified,
        I_SESSION: this.XORDecryptRes.sessionid,
        I_USERID: this.XORDecryptRes.mobile
      }
      this.fetch.push(this.apiservice.Submitconsent(consentBody));

      Promise.all(this.fetch).then((responses) => {
        this.loader = false;
        let success = responses?.filter((response: any) => {
          return response.RESULT_CODE === "200"
        })
        if (success.length > 0) {
          this.router.navigate(['lottie'],
            { queryParams: { 'success': 'Yes' } });
        } else {
          this.router.navigate(['lottie'],
            { queryParams: { 'success': 'No' } });
        }
      })
    })
  }

  navigatetomobilepage() {
    this.router.navigate(['Addmobile']);
  }

  ngOnDestroy() {
    this.storage.setcrossconflag(false);
  }
}