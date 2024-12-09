import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { EncryptUrlService } from 'src/app/services/encrypt-url.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-denyand-exit',
  templateUrl: './denyand-exit.component.html',
  styleUrls: ['./denyand-exit.component.css']
})
export class DenyandExitComponent implements OnInit {
  selectedCard : string = "";
  bankFi = [
    {
      id: 1,
      name: 'Don’t understand about linking bank accounts',
    },
    {
      id: 2,
      name: 'Fearful of data being misused!',
    },
    {
      id: 3,
      name: 'Couldn’t find my bank account',
    },
    {
      id: 4,
      name: 'Other',
    }
  ] 
  XORDecryptRes: any;
  
  constructor(private router: Router,private Encrypt : EncryptUrlService,private _bottomSheetRef: MatBottomSheetRef<DenyandExitComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,private apiservice: BackendApiService, private storage: StorageServiceService) {
  }
  
  ngOnInit() {
    this.storage.getCurrentFiCategory.subscribe(res => {
     this.Getcontent(res);
    });    
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
  }

  Getcontent(activeCategory:any){
    switch(activeCategory){
      case 'GSTR':{
        let id1data= {
          id: 1,
          name: 'Don’t understand about linking accounts',
        }
        this.bankFi.splice(0,1,id1data);
        let data = {
          id: 3,
          name: 'Couldn’t find my GST account'
        }
        this.bankFi.splice(2,1,data);
        break; 
      }

      case 'MF':{
        let id1data= {
          id: 1,
          name: 'Don’t understand about linking accounts',
        }
        this.bankFi.splice(0,1,id1data);
        let id3data = {
          id: 3,
          name: 'Couldn’t find my folios'
        }
        this.bankFi.splice(2,1,id3data);
        break; 
      }
      
      case 'NPS':{
        let id1data= {
          id: 1,
          name: 'Don’t understand about linking accounts',
        }
        this.bankFi.splice(0,1,id1data);
        let data = {
          id: 3,
          name: 'Couldn’t find my NPS account'
        }
        this.bankFi.splice(2,1,data);
        break; 
      }

      case 'EQUITIES':{
        let id1data= {
          id: 1,
          name: 'Don’t understand about linking accounts',
        }
        this.bankFi.splice(0,1,id1data);
        let data = {
          id: 3,
          name: 'Couldn’t find my DP ID account'
        }
        this.bankFi.splice(2,1,data);
        break; 
      }

      case 'INSURANCE_POLICIES':{
        let id1data= {
          id: 1,
          name: 'Don’t understand about linking accounts',
        }
        this.bankFi.splice(0,1,id1data);
        let data = {
          id: 3,
          name: 'Couldn’t find my insurance policies'
        }
        this.bankFi.splice(2,1,data);
        break; 
      }

      default :{
        let data = {
          id: 3,
          name: 'Couldn’t find my bank account'
        }
        this.bankFi.splice(2,1,data);
        break; 
      }
    }
  }

  handleRadioClick(name:string){
    this.selectedCard = name;
  }

  exit(){
    this._bottomSheetRef.dismiss();
    this.router.navigate(['lottie'],
    { queryParams: { 'success': 'No','Reason': this.selectedCard}});
  }

  cancel(){
    this._bottomSheetRef.dismiss();
  }
}
