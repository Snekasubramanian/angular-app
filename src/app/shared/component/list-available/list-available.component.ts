import { Component,Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-list-available',
  templateUrl: './list-available.component.html',
  styleUrls: ['./list-available.component.css']
})
export class ListAvailableComponent implements OnInit {
  isBank : boolean = true;
  constructor(private storage: StorageServiceService,private _bottomSheetRef: MatBottomSheetRef<ListAvailableComponent>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }

  ngOnInit() {
    this.storage.getCurrentFiCategory.subscribe(res => {
      this.isBank = res == 'BANK' ? true : false;
     });
  }
    close(){
    this._bottomSheetRef.dismiss();
  }
}
