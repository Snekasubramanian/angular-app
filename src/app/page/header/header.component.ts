import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { StorageServiceService } from 'src/app/services/storage-service.service';
import { DenyandExitComponent } from 'src/app/shared/component/denyand-exit/denyand-exit.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  logo : string = "../../../assets/images/com_logo.png";
  Enablecrossbtn = false;
  Enablbackbtn = false;
  constructor(public router: Router,private _bottomSheet: MatBottomSheet, private storage: StorageServiceService) {

   }

   ngOnInit() {
    this.storage.getCrossbtn.subscribe((res:any)=>{
      this.Enablecrossbtn = res;
    })

    this.storage.getEnableBackbtn.subscribe((res:any)=>{
      this.Enablbackbtn = res;
    })
    this.storage.getMessage.subscribe(res => {
      this.logo = !!res?.logo ? environment.IMAGE_BASE_URL+res.logo : '../../../assets/images/com_logo.png' ;
    });
   }
  opendrawer() {
    this._bottomSheet.open(DenyandExitComponent,
      {
        hasBackdrop: true
      });
  }

  Back(){
    history.back()
  }
}
