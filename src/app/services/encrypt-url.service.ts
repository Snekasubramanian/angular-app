import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { StorageServiceService } from './storage-service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptUrlService {
  XORDecryptRes: any;
  apiurl : any = environment.API_BASE_URL+'/api/aa/WPortalapiV1/';
  requestHeaders = new HttpHeaders();
  constructor(private http:HttpClient,private storage: StorageServiceService) { 
    this.storage.getMessage.subscribe(res => {
      this.XORDecryptRes = res;
    });
  }

  public GenerateEncryptedUrl(data:any) {
    let AAId = 'AA00022222'
    const ecResponseValue = Object.keys(data).reduce(
      (currentValue, ecResponsetKey, index) => {
        if (index === 0) {
          currentValue += `${ecResponsetKey}=${data[ecResponsetKey]}`
        } else {
          currentValue += `&${ecResponsetKey}=${data[ecResponsetKey]}`
        }
        return currentValue
      },
      ''
    )
    const reqDate = moment(new Date()).format('DDMMYYYYhhmmsss')
    const encryptRes = {
      fiuid:this.XORDecryptRes.fiuid,
      AAId:AAId,
      ecRequest: ecResponseValue,
      reqDate:reqDate
    }
    return this.http.post(this.apiurl+'AES256_XOR_Encrypt',encryptRes, { headers:this.requestHeaders }).pipe(
      map((res: any) => {
        if(!!this.XORDecryptRes.redirect){
        const constructedURL = `ecres=${res?.ecreq}&resdate=${reqDate}&fi=${CryptoJS.enc.Base64.stringify(this.xorEncryptWordArray(AAId, reqDate))}`
        if (this.checkIfURLHasQueryParams(this.XORDecryptRes.redirect)) {
          return `${this.XORDecryptRes.redirect}&${constructedURL}`
        }
        return `${this.XORDecryptRes.redirect}?${constructedURL}`
      }else{
        return '';
      }
      })
    );
  }
  
  xorEncryptWordArray (data: string, key: string): CryptoJS.lib.WordArray {
    function keyCharAt (key: string, i: number) {
      return key.charCodeAt(Math.floor(i % key.length))
    }
    function byteArrayToWordArray (ba: any) {
      const wa: any[] = []
      for (let i = 0; i < ba.length; i++) {
        wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i)
      }
      return CryptoJS.lib.WordArray.create(wa, ba.length)
    }
    const res = data.split('').map(function (c, i) {
      return c.charCodeAt(0) ^ keyCharAt(key, i)
    })
    return byteArrayToWordArray(res)
  }

  checkIfURLHasQueryParams = (url: string): boolean => {
    const formattedURL = new URL(url)
    return Boolean(formattedURL.search)
  }
}
