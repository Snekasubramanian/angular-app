import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { EncryptUrlService } from 'src/app/services/encrypt-url.service';
import { StorageServiceService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-lottie-loader',
  templateUrl: './lottie-loader.component.html',
  styleUrls: ['./lottie-loader.component.css']
})
export class LottieLoaderComponent {
  XORDecryptRes: any=[];
  flag : string="";
  dynValue: string="";
  Reason : string="";
  constructor(private router: Router,private route: ActivatedRoute,private apiservice: BackendApiService,private storage: StorageServiceService,private Encrypt : EncryptUrlService) { }


  ngOnInit() {
    console.log(this.router)
    this.route.queryParams.subscribe(params => {
    this.flag = params['success'];
    this.Reason = !!params['Reason'] ? params['Reason'] : "";
  });
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
    this.storage.getdynData.subscribe(res => {
      this.dynValue = res;
    });

    if(this.flag == 'No'){
      let fetch : any = [];
      this.storage.getconsentData.subscribe(res =>{
        res.map((consentvalue: any) => {
        const consentDenyPayload = {
          I_MOBILENUMBER: this.XORDecryptRes.mobile,
          I_BROWSER: 'chrome',
          I_ConsentHandle: consentvalue,
          I_SESSION: this.XORDecryptRes.sessionid,
          I_USERID: this.XORDecryptRes.mobile,
          I_FIUID: this.XORDecryptRes.fiuid,
          I_REASON: this.Reason,
          I_PAGE: 'Account_Discovery',
          I_STATUS: 'PENDING'
        }
        fetch.push(this.apiservice.Denyconsent(consentDenyPayload));
      })
    })
        Promise.all(fetch).then((responses)=>{
          console.log(responses)
          this.Redirection();
        })
    }else{
      this.Redirection();
    }
  }

  Redirection(){
    const ecres = {
      addfip: this.XORDecryptRes.addfip,
      txnid: this.XORDecryptRes.txnid,
      sessionid: this.XORDecryptRes.sessionid,
      userid: this.XORDecryptRes.userid,
      srcref: this.dynValue,
      redirect: this.XORDecryptRes.redirect,
      status: this.flag == 'Yes'? 'S' :'F',
      errorcode: this.flag == 'Yes'? '0' :'1'
    }
    this.Encrypt.GenerateEncryptedUrl(ecres).subscribe((res:any)=>{
      setTimeout(()=>{ 
      if (!(this.XORDecryptRes.redirect === '')) {
        window.location.replace(res) // Replace Redirect URL here
      } else {
          window.location.replace(window.location.origin);
      }
    },3000);
    })
  }
}
