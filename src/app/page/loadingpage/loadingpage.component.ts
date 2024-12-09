import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-loadingpage',
  templateUrl: './loadingpage.component.html',
  styleUrls: ['./loadingpage.component.css']
})
export class LoadingpageComponent implements OnInit{
  dynValue: any =[];

  constructor(private auth : AuthService, private apiservice : BackendApiService,private router: Router, private storage : StorageServiceService) { }

  ngOnInit(){
    this.auth.Authentication().subscribe((res:any) => {
      if(res.statusCode == '200'){
        sessionStorage.setItem('token',res.token);
        this.RedirectAA(res.sessionId);
      }
    })
  }

  RedirectAA(sessionId:any){
    let raw = JSON.stringify({
      clienttrnxid: '04502d0c9c4b400388450c65fd01bd23',
      fiuID: 'STERLING-FIU-UAT',
      userId: 'athira.j@camsonline.com',
      aaCustomerHandleId: '9600022364@CAMSAA', /* 8870960823 */
      aaCustomerMobile: '9600022364',
      sessionId: sessionId,
      useCaseid: '148',
      // pan:"FKKPM8398L",
      //  fipid: 'fipcamsuat@citybank' /* HDFC */
      // fipid: 'CAMSGST_UAT',
      // fipid: 'Cams Depository,CDSLFIP',
      // fipid: 'HDFC'
      // fipid:'ETLIFIP_UAT'
      // fipid: 'HAMC'
    })
    this.auth.Redirection(raw).subscribe((result:any) => {
      let pattern = result.redirectionurl.indexOf("?")
      let matchPattern = result.redirectionurl.substring(0,pattern)
      const newUrl = result.redirectionurl.replace(matchPattern,'http://localhost:4200');
      window.history.replaceState( {} , 'http://localhost:4200', newUrl );
      this.XORDecrypt(window.location.search)
    })
  }

  XORDecrypt(url : any){
    const urlParams = new URLSearchParams(url)
    const fiuId = urlParams.get('fi') ?? ''
    const ecRequest = urlParams.get('ecreq') ?? ''
    const reqDate = urlParams.get('reqdate') ?? ''
    const data = {
      fiuId,
      ecRequest,
      reqDate,
      flag: 'user_validation'
    }
    this.apiservice.XORDecryptservice(data).subscribe((res :any) => {
      this.storage.updateDecrypt(res);
      if(typeof (res?.srcref) === 'object'){
         this.dynValue  = [];
        res?.srcref.map((val : any, index: number) => {
          const newValue = val.split('|');
           this.dynValue.push(newValue[2]);
        })
        this.storage.MULTI_CONSENT_ARRAY(this.dynValue);
        let consentValue = ""
         this.dynValue.map((val : any, index: any) => {
           consentValue = consentValue + val 
           if(index ===  this.dynValue.length - 1){
            consentValue = consentValue
           }else{
            consentValue = consentValue + ","
           }
        })
        this.storage.MULTI_CONSENT(consentValue);
      }else{
         this.dynValue = [];
         this.dynValue.push(res?.srcref)
        this.storage.MULTI_CONSENT_ARRAY(this.dynValue);
        this.storage.MULTI_CONSENT(res?.srcref);
      }
      this.router.navigate(['Verifyotp']);
    })
  }

}
