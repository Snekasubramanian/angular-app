import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { environment } from 'src/environments/environment';
import { VerifybankOtpComponent } from '../verifybank-otp/verifybank-otp.component';
import { FixdrawerComponent } from '../fixdrawer/fixdrawer.component';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.css']
})
export class BankListComponent implements OnInit{

  @Input() key:any;
  @Input() logo:any;
  @Input() indicator:any;
  @Input() bankName:any;
  @Input() bankCounts:any;
  @Input() list:any;
  @Input() partialLoader : any;
  imgUrl = environment.IMAGE_BASE_URL;
  XORDecryptRes: any=[];
  dynValue: any=[];
  discoverBankResponse: any;
  choosebanklist: any;
  currentCategory :string ="";
  linkedFlag : boolean = false;
  constructor(private apiservice: BackendApiService,private _bottomSheet: MatBottomSheet, private storage: StorageServiceService) {
  }
  ngOnInit() {
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
      this.linkedFlag = this.list.filter((x:any)=> x.Linked).length == this.list.length;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });
    this.storage.getFipdetails.subscribe(res => {
      this.choosebanklist = res;
    });
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.currentCategory = res;
    });
  }

  isDisabled() {
    return this.list.filter((d: any) => !d.Linked && d.isChecked).length > 0 ? false : true;
  };

  getLogo(logo : string){
    if(!!logo){
      return this.imgUrl+logo;
    }else{
      let logourl = this.currentCategory;
      return `../../../assets/images/`+logourl+`.svg`
    }
  }
  Linkconsent(list:any){
    this._bottomSheet.open(VerifybankOtpComponent,
      {
        data:list,
        hasBackdrop: true
      });
  }

  fixbtn(Name:any){
    this.discoverBankResponse.map((val:any)=>{
      if(val.FIPNAME == Name){
        val.PartialLoader = true;
      }else{
        val.PartialLoader = false;
      }
    })
    let dialogRef = this._bottomSheet.open(FixdrawerComponent,
      {
        data:Name,
        hasBackdrop: true
      });
      dialogRef.afterDismissed().subscribe(result => {
        if(result == 1){
          this.partialLoader = true;
          let fetch : any =[];
          let fip = this.choosebanklist.filter((val: any) => val.FIPNAME === Name);
          const data = {
            I_MOBILENUMBER: this.XORDecryptRes.mobile,
            I_BROWSER: 'chrome',
            I_Identifier: [{ I_Flag: 'MOBILE', DATA: this.XORDecryptRes.mobile, type: 'STRONG' }],
            I_FITYPE: this.XORDecryptRes.fIType,
            I_FIPID: fip[0]?.FIPID,
            I_FIPNAME: '', // ASK
            I_SESSION: this.XORDecryptRes.sessionid,
            I_USERID: this.XORDecryptRes.mobile,
            I_ConsentHandle: this.XORDecryptRes.srcref
          }
          fetch.push(this.apiservice.discoverdata(data));
    
          Promise.all(fetch).then((responses)=>{
            this.partialLoader = false;
            let decryptedResponse = responses[0];
            if (decryptedResponse.AccountCount > 0) {
              let AlreadyhaveAccounts = this.discoverBankResponse.filter((val: any) => val.FIPNAME !== decryptedResponse.FIPName)
              decryptedResponse?.fip_DiscoverLinkedlist.map((val: any) => AlreadyhaveAccounts.push(val));
              this.storage.updatediscover(AlreadyhaveAccounts);
          }
          })
          .catch((error: any)=>{
            this.partialLoader = false;
          });
        }
      });
  }
}
