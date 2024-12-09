import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AESEncryptDecryptServiceService } from 'src/app/services/aesencrypt-decrypt-service.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-discoverloader',
  templateUrl: './discoverloader.component.html',
  styleUrls: ['./discoverloader.component.css']
})
export class DiscoverloaderComponent implements OnInit {
  XORDecryptRes: any;
  FixFIPNAME: any='';
  discoverBankResponse: any=[];
  isPanRequired: boolean = false;
  Try_again_count: number = 0;
  constructor(private encrypt : AESEncryptDecryptServiceService,private router: Router,private apiservice: BackendApiService,private storage: StorageServiceService) { }
  Fiplist: any = [];
  fetch: any = [];
  dynValue : any ;
  activeCategory : string = 'BANK'
  ngOnInit() {
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.activeCategory = res;
     this.isPanRequired = this.activeCategory === 'MF' || this.activeCategory === 'GSTR' || this.activeCategory === 'EQUITIES'
     });   
     this.storage.getFixFIPName.subscribe(res => {
      this.FixFIPNAME = res;
     }); 
     this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.storage.GetTryagain_count.subscribe(res =>{
      this.Try_again_count = res;
    })
    this.storage.getFipdetails.subscribe(res => {
      if(res.length==0){
        this.getFipDetails();
      }else{
        this.Fiplist = res;
      }
    })
    if(this.isPanRequired && this.XORDecryptRes.pan == ''){
      this.router.navigate(["PanRequired"])
    }else{
      this.getDiscoverAccount();
    }
}

getDiscoverAccount(){
  this.XORDecryptRes.fipid.split(',').map((fipId: any) => {
    const data = {
      I_MOBILENUMBER: this.XORDecryptRes.mobile,
      I_BROWSER: 'chrome',
      I_Identifier: this.Identifier(),
      I_FITYPE: this.XORDecryptRes.fIType,
      I_FIPID: fipId,
      I_FIPNAME: '', // ASK
      I_SESSION: this.XORDecryptRes.sessionid,
      I_USERID: this.XORDecryptRes.mobile,
      I_ConsentHandle: this.dynValue
    }
    this.fetch.push(this.apiservice.discoverdata(data));
  })

    Promise.all(this.fetch).then((responses)=>{
      let MergeArray: any = [];
      let accountCount: number = 0;
      if (!!this.FixFIPNAME) {
        let AlreadyhaveAccounts: [] = this.discoverBankResponse.filter((val: any) => val.FIPNAME !== this.FixFIPNAME);
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
      this.storage.updatediscover(Finalresult);
      if (accountCount === 0) {
        this.storage.set_count(this.Try_again_count+1);
        this.router.navigate(['warningPage']);
      }else{
        this.router.navigate(['userBank']);
      }
    })
    .catch((error: any)=>{
            console.log(error);
    });
}
Identifier() {

  if(!!this.XORDecryptRes.pan){
    return [
      {
        I_Flag: 'MOBILE',
        DATA: !!this.XORDecryptRes.mobile ? this.XORDecryptRes.mobile : '',
        type: 'STRONG',
      },
      {
        I_Flag: 'PAN',
        DATA: this.XORDecryptRes.pan,
        type: 'WEAK',
      }
    ]
  }else{
    return [
      {
        I_Flag: 'MOBILE',
        DATA: this.XORDecryptRes!.mobile ? this.XORDecryptRes.mobile : '',
        type: 'STRONG',
      }
    ]
  }
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
    }
  })

}
}
