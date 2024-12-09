import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageServiceService {

  public XORDecryptRes = new BehaviorSubject<any>(null);
  getMessage = this.XORDecryptRes.asObservable();

  public discoverBankResponse = new BehaviorSubject<any>([]);
  getdiscoverBankResponse = this.discoverBankResponse.asObservable();


  public consentData = new BehaviorSubject<any>(null);
  getconsentData = this.consentData.asObservable();


  public dynData = new BehaviorSubject<any>(null);
  getdynData = this.dynData.asObservable();

  public consentdetails = new BehaviorSubject<any>([]);
  getconsentdetails = this.consentdetails.asObservable();

  public Fipdetails = new BehaviorSubject<any>([]);
  getFipdetails = this.Fipdetails.asObservable();

  public FiCategory = new BehaviorSubject<any>(null);
  getFiCategory = this.FiCategory.asObservable();

  public CurrentFiCategory = new BehaviorSubject<any>(null);
  getCurrentFiCategory = this.CurrentFiCategory.asObservable();

  public FixFIPName = new BehaviorSubject<any>(null);
  getFixFIPName = this.FixFIPName.asObservable();

  public EnableBackbtn = new BehaviorSubject<any>(false);
  getEnableBackbtn = this.EnableBackbtn.asObservable();
  
  public Crossbtn = new BehaviorSubject<any>(false);
  getCrossbtn = this.Crossbtn.asObservable();

  public Try_again_count = new BehaviorSubject<number>(0);
  GetTryagain_count = this.Try_again_count.asObservable();

  setcrossconflag(data:any){
    this.Crossbtn.next(data);
  }

  setbackconflag(data:any){
    this.EnableBackbtn.next(data);
  }

  updateDecrypt(data: any) {
    this.XORDecryptRes.next(data);
  }

  updatediscover(data: any) {
    this.discoverBankResponse.next(data);
  }

  MULTI_CONSENT_ARRAY(data: any) {
    this.consentData.next(data);
  }

  MULTI_CONSENT(data: any) {
    this.dynData.next(data);
  }

  CONSENT_DETAILS(data:any){
    this.consentdetails.next(data);
  }

  Update_fip(data:any){
    this.Fipdetails.next(data);
  }

  Set_fipcatergory(data:any){
    this.FiCategory.next(data);
  }

  Set_Currentfipcatergory(data:any){
    this.CurrentFiCategory.next(data);
  }

  set_fixfipname(data:any){
    this.FixFIPName.next(data);
  }
  set_count(data:any){
    this.Try_again_count.next(data);
  }
}
