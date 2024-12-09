import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { ListAvailableComponent } from 'src/app/shared/component/list-available/list-available.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-choose-bank',
  templateUrl: './choose-bank.component.html',
  styleUrls: ['./choose-bank.component.css']
})
export class ChooseBankComponent implements OnInit,OnDestroy{
  @ViewChild('auto') matAutocomplete: MatAutocomplete | any;
  myControl:string = "";
  XORDecryptRes: any =[];
  changedvalue:string = "";
  Banklist: any=[];
  OriginalBanklist : any=[];
  popularBank:any=[];
  selectedBank:any=[];
  imgUrl = environment.IMAGE_BASE_URL;
  disablebtn : boolean = true;
  isBank: boolean = true;
  placeholder:string = "";
  discoverBankResponse : any = [];
  constructor(private _bottomSheet: MatBottomSheet,private router: Router,private apiservice: BackendApiService,private storage: StorageServiceService) { 
  }
  
  ngOnInit() {
    this.storage.setbackconflag(true);
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.storage.getFipdetails.subscribe(res => {
      this.Banklist = res;
      this.OriginalBanklist = JSON.parse(JSON.stringify(res));
      this.Banklist.forEach((x:any)=>{
        x['isChecked'] = false;
      })
    });
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.isBank = res == 'BANK' ? true : false;
      this.placeholder = res == 'BANK' ? 'Search banks' : 'Search insurer';
     });
    this.popularBank = this.Banklist.filter((x: any) => x.POPULARBANK == 'Y');

  }

  Filterdata(){
    this.changedvalue = JSON.parse(JSON.stringify(this.myControl));
    if(!!this.myControl){
      this.Banklist = this.OriginalBanklist.filter((option:any) => option.FIPNAME.toLowerCase().includes(this.myControl.toLowerCase()));
    }else{
      this.Banklist =  this.OriginalBanklist;
    }
  }

  open(trigger : any) {
    trigger.openPanel();
  }
  getLogo(logo : string){
    if(!!logo){
      return this.imgUrl+logo;
    }else{
      return this.isBank ? `../../../assets/images/BANK.svg` :  `../../../assets/images/INSURANCE_POLICIES.svg`;
    }
  }

  getfip(id:any){
    this.Banklist.filter((item:any)=>{
      if(item.FIPID == id){
        item.isChecked = !item.isChecked;
      }
    })
    this.disablebtn = this.Banklist.filter((x: any) => x.isChecked).length > 0 ? false : true;
    this.popularBank = this.Banklist.filter((x: any) => (x.POPULARBANK == 'Y' || x.isChecked) && x.POPULARBANK != 'N');
    this.selectedBank = this.Banklist.filter((x: any) => x.POPULARBANK == 'N' && x.isChecked);
    this.myControl = this.changedvalue;
  }

  discover(){
    let discoverFIpid :any=[];
    this.Banklist.filter((x:any)=>{
      if(x.isChecked){
        discoverFIpid.push(x.FIPID);
      }
    })
    let redirection = this.discoverBankResponse.filter((x:any)=> x.FIPACCTYPE == 'Not_found').length == this.discoverBankResponse.length;
      if(!redirection){
        this.XORDecryptRes.fixFipid = discoverFIpid.toString();
        this.storage.updateDecrypt(this.XORDecryptRes);
        this.router.navigate(["userBank"]);
      }else{
        this.XORDecryptRes.fipid = discoverFIpid.toString();
        this.storage.updateDecrypt(this.XORDecryptRes);
        this.router.navigate(["discoverloader"]);
      }
  }

  Showlist(){
    this._bottomSheet.open(ListAvailableComponent,
      {
        data:this.Banklist,
        hasBackdrop: true
      });
  }
  ngOnDestroy() {
    this.storage.setbackconflag(false);
  }
}
