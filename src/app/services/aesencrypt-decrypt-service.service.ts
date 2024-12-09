import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as shajs from 'sha.js'

@Injectable({
  providedIn: 'root'
})
export class AESEncryptDecryptServiceService {
  constructor() { }

  encrypt(InputString : string) : string{
    let Encryptionkey = 'aGgRTenEUgoACtcOAr';
    let hashstring = shajs('sha256').update(Encryptionkey).digest('hex');
    let hashsubstring = hashstring.substring(0, 32);
    let iv = CryptoJS.enc.Utf8.parse('globalaesvectors')
    let Enckey = CryptoJS.enc.Utf8.parse(hashsubstring)
    let Encrypted: any = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(InputString),
      Enckey,
      {
        keySize: 128 / 8,
        iv:iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    Encrypted = Encrypted.ciphertext.toString(CryptoJS.enc.Base64)

    Encrypted = Encrypted.split('+').join('-')
    Encrypted = Encrypted.split('/').join('_')
    return Encrypted
  }

  decrypt(InputString : string){
    let Encryptionkey = 'AecECroRUgnGTa';
    let hashstring = shajs('sha256').update(Encryptionkey).digest('hex');
    let hashsubstring = hashstring.substring(0, 32);
    let iv = CryptoJS.enc.Utf8.parse('globalaesvectors')
    let Enckey = CryptoJS.enc.Utf8.parse(hashsubstring)
      let Dencryptedinput = InputString.split('-').join('+')
      Dencryptedinput = Dencryptedinput.split('_').join('/')
      let Dencrypted: any = CryptoJS.AES.decrypt(Dencryptedinput, Enckey, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      Dencrypted = Dencrypted.toString(CryptoJS.enc.Utf8)
    return JSON.parse(Dencrypted)
  }

  Errordecrypt(InputString : string){
    let Encryptionkey = 'aGgRTenEUgoACtcOAr';
    let hashstring = shajs('sha256').update(Encryptionkey).digest('hex');
    let hashsubstring = hashstring.substring(0, 32);
    let iv = CryptoJS.enc.Utf8.parse('globalaesvectors')
    let Enckey = CryptoJS.enc.Utf8.parse(hashsubstring)
      let Dencryptedinput = InputString.split('-').join('+')
      Dencryptedinput = Dencryptedinput.split('_').join('/')
      let Dencrypted: any = CryptoJS.AES.decrypt(Dencryptedinput, Enckey, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      Dencrypted = Dencrypted.toString(CryptoJS.enc.Utf8)
    return JSON.parse(Dencrypted)
  }
}
