import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-important',
  templateUrl: './important.component.html',
  styleUrls: ['./important.component.css']
})
export class ImportantComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<ImportantComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
   
  }


  close(data:any){
    this._bottomSheetRef.dismiss(data);
  }
}
