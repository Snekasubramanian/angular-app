import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-consent-drawer',
  templateUrl: './consent-drawer.component.html',
  styleUrls: ['./consent-drawer.component.css']
})
export class ConsentDrawerComponent implements OnInit{
  consentData : any = [];
  view : boolean = false;
  ConsentForm! : FormGroup;
  constructor(private _bottomSheetRef: MatBottomSheetRef<ConsentDrawerComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    console.log(data)

  }

  ngOnInit() {
    this.ConsentForm =  this.data.form;
    this.consentData = this.data.consent[this.data.index];
  }

  openLink(event: MouseEvent): void {
   this._bottomSheetRef.dismiss(this.ConsentForm);
   event.preventDefault();
 }

 tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  this.data.index = tabChangeEvent.index;
  this.consentData = this.data.consent[tabChangeEvent.index];
}
 
 viewMoreClick(){
  this.view = !this.view;
 }

 disable(){
  if(this.data.consent.length>1){
    return !this.ConsentForm.valid;
  }else{
    return false;
  }
 }
}
