import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-warning-page',
  templateUrl: './warning-page.component.html',
  styleUrls: ['./warning-page.component.css']
})
export class WarningPageComponent implements OnInit, OnDestroy {
  selectedCard : number = 1; 
  buttonName : string = "Try again";
  XORDecryptRes: any;
  imgUrl = environment.IMAGE_BASE_URL;
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
  discoverBankResponse: any=[];
  currentCategory: any;
  remindlater : boolean = false;
  constructor(private apiservice: BackendApiService, private router: Router, private storage: StorageServiceService) {
  }

  ngOnInit() {
    this.storage.setcrossconflag(true);
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdiscoverBankResponse.subscribe(res => {
      this.discoverBankResponse = res;
    });
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.currentCategory = res;
     this.Getcontent(res);
    });
    this.storage.GetTryagain_count.subscribe(res =>{
      this.remindlater = res > 1 ? true: false;
      if(this.remindlater){
        let data = {
          heading:"Remind me later!",
          description:"There might be a technical issue. We can notify to try later.",
          id:1
        }
        this.displayList.splice(0,1,data);
        this.currentCategory == 'BANK' ?  this.displayList.splice(2,1):"";
        this.buttonName = this.remindlater ? 'Remind later': 'Try again';
      }
    })
  }

  handleCardClick(id:any){
    this.selectedCard = id;
    
  if (this.selectedCard === 1) {
    this.buttonName = this.remindlater ? 'Remind later': 'Try again';
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
      this.buttonName == 'Try again' ? this.router.navigate(['discoverloader']) : this.router.navigate(['Remindlater']);
    }else if(this.selectedCard === 2){
      this.router.navigate(['Modifynumber']);
    }else if(this.selectedCard === 3){
      if(this.currentCategory === 'GSTR' || this.currentCategory === 'MF' || this.currentCategory === 'EQUITIES'){
        this.router.navigate(["PanRequired"])
      }else{
        this.router.navigate(['ChooseBank']);
    }
    }
  }

  getLogo(logo : string){
    if(!!logo){
      return this.imgUrl+logo;
    }else{
      let logourl = this.currentCategory;
      return `../../../assets/images/`+logourl+`.svg`
    }
  }

   deleteCard (id: any) {
    this.discoverBankResponse=  this.discoverBankResponse?.filter((val: any, index: number) => index !== id);
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
          },
          {
            heading:"Try with another PAN",
            description:"Change your PAN and discover",
            id:3
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
            heading:"My mobile number is correct",
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
  ngOnDestroy() {
    this.storage.setcrossconflag(false);
  }
}
