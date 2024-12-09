import { Component,Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-fixdrawer',
  templateUrl: './fixdrawer.component.html',
  styleUrls: ['./fixdrawer.component.css']
})
export class FixdrawerComponent implements OnInit {
  displayList =[
    {
      heading:"My mobile number is correct!",
      description:"Retry with the same bank accounts",
      id:1
    },
    {
      heading:"Try with another number",
      description:"Quickly change your number and discover",
      id:2
    },
    {
      heading:"It is a joined account?",
      description:"Joint accounts are not supported yet. Choose another bank you have an account.",
      id:3
    }
  ]
  XORDecryptRes: any;
  discoverBankResponse: any;
  selectedCard : number = 1; 
  buttonName : string = "Try again";
  bankNameList: string = "";
  dynValue: any;
  choosebanklist: any;
  currentCategory: any;
  constructor(private _bottomSheetRef: MatBottomSheetRef<FixdrawerComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private router: Router, private storage: StorageServiceService) {
  }
  
  ngOnInit() {
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.currentCategory = res;
     this.Getcontent(res);
    });
  }

  handleCardClick(id:any){
    this.selectedCard = id;
    
  if (this.selectedCard === 1) {
    this.buttonName = 'Try again'
  } else if (this.selectedCard === 2) {
    this. buttonName = 'Modify number'
  } else {
    if(this.currentCategory === 'GSTR' || this.currentCategory === 'MF' || this.currentCategory === 'EQUITIES'){
    this.buttonName = 'Modify PAN'
    }else{
      this.buttonName = this.currentCategory == 'INSURANCE_POLICIES'? 'Change insurer':'Change bank'
    }
  }
  }

  
  submitbtn(){
    if (this.selectedCard === 1) {
      this._bottomSheetRef.dismiss(1);
    }else if(this.selectedCard === 2){
      this._bottomSheetRef.dismiss(2);
      this.router.navigate(['Modifynumber']);
    }else if(this.selectedCard === 3){
      this._bottomSheetRef.dismiss(3);
      if(this.currentCategory === 'GSTR' || this.currentCategory === 'MF' || this.currentCategory === 'EQUITIES'){
        this.router.navigate(["PanRequired"])
      }else{
        this.storage.set_fixfipname(this.data);
        this.router.navigate(['ChooseBank']);
    }
    }
  }

  Getcontent(activeCategory:any){
    switch(activeCategory){
      case 'GSTR':{
        this.displayList = [
          {
            heading:"GST is linked with same information",
            description:"Retry with the same mobile/PAN",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          }
        ]
        break; 
      }

      case 'MF':{
        this.displayList = [
          {
            heading:"MF is linked with same information",
            description:"Retry with the same mobile/PAN",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          },
          {
            heading:"Try with another PAN",
            description:"Change your PAN and discover",
            id:3
          }
        ]
        break; 
      }
      
      case 'NPS':{
        this.displayList = [
          {
            heading:"My mobile number is correct!",
            description:"Retry with the same number",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          }
        ]
        break; 
      }

      case 'EQUITIES':{
        this.displayList = [
          {
            heading:"My mobile number is correct!",
            description:"Retry with the same number",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          },
          {
            heading:"Try with another PAN",
            description:"Change your PAN and discover",
            id:3
          }
        ]
        break; 
      }

      case 'INSURANCE_POLICIES':{
        this.displayList = [
          {
            heading:"My mobile number is correct!",
            description:"Retry with the same number",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          },
          {
            heading:"Try with another insurer",
            description:"Change policy insurer and discover",
            id:3
          }
        ]
        break; 
      }

      default :{
        this.displayList = [
          {
            heading:"My mobile number is correct!",
            description:"Retry with the same bank accounts",
            id:1
          },
          {
            heading:"Try with another number",
            description:"Quickly change your number and discover",
            id:2
          },
          {
            heading:"It is a joined account?",
            description:"Joint accounts are not supported yet. Choose another bank you have an account.",
            id:3
          }
        ]
        break; 
      }
    }
  }
}
