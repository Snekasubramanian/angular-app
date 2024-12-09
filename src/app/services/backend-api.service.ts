import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  apiurl : any = environment.API_BASE_URL+'/api/aa/WPortalapiV1/';
  requestHeaders = new HttpHeaders();
  constructor(private http:HttpClient) { }

  XORDecryptservice(data : any) {
    return this.http.post(this.apiurl+'AES256_XOR_Decrypt',data, { headers:this.requestHeaders });
  }

  triggerotp(data : any) {
    return this.http.post(this.apiurl+'TRIGGEROTP',data, { headers:this.requestHeaders });
  }

  generateotp(data : any) {
    return this.http.post(this.apiurl+'GENERATEOTP',data, { headers:this.requestHeaders });
  }

  getConcentHandelDetails(data : any) {
    return this.http.post(this.apiurl+'GETCONSENTHANDLEDETAILS',data, { headers:this.requestHeaders });
  }

  getMobileNumber(data : any) {
    return this.http.post(this.apiurl+'GETMOBILENUMBERS',data, { headers:this.requestHeaders });
  }

  discoverdata(data:any): Promise<any> {
    return new Promise<any>((resolve,reject) => {
        this.http.post(this.apiurl+'GetFipDiscoverAndLinkedAccounts',data, { headers:this.requestHeaders }).subscribe((response) => {
            resolve(response);
        }, (error) => reject(error));
    });
}

Submitconsent(data:any): Promise<any> {
  return new Promise<any>((resolve,reject) => {
      this.http.post(this.apiurl+'ConsentArtefact_V1',data, { headers:this.requestHeaders }).subscribe((response) => {
          resolve(response);
      }, (error) => reject(error));
  });
}


Denyconsent(data:any): Promise<any> {
  return new Promise<any>((resolve,reject) => {
      this.http.post(this.apiurl+'ConsentDenyReason',data, { headers:this.requestHeaders }).subscribe((response) => {
          resolve(response);
      }, (error) => reject(error));
  });
}
Verifyotp(data : any) {
  return this.http.post(this.apiurl+'VERIFYOTP_V1',data, { headers:this.requestHeaders });
}

NewnumberVerifyotp(data:any){
  return this.http.post(this.apiurl+'ADDNEWMOBILE',data, { headers:this.requestHeaders });
}

SearchFip(data:any){
  return this.http.post(this.apiurl+'SearchFIP',data, { headers:this.requestHeaders });
}

linkConsent(data:any){
  return this.http.post(this.apiurl+'Link',data, { headers:this.requestHeaders });
}

AuthenticateToken(data:any){
  return this.http.post(this.apiurl+'AuthenticateToken',data, { headers:this.requestHeaders });
}

getFicategory(data:any){
  return this.http.post(this.apiurl+'GetFICategoryByType',data, { headers:this.requestHeaders });

}
}
