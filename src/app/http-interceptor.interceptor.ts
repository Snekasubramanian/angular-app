import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { AESEncryptDecryptServiceService } from './services/aesencrypt-decrypt-service.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor( private encrypt : AESEncryptDecryptServiceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let header : any;
    if(req.url.includes('camsfinserv')){
    req = req.clone({ 
      headers:  req.headers.set('Content-Type', 'text/plain').set('Authorization', `Bearer ${sessionStorage.getItem('token')}`).set('UUID',uuidv4()),
      body: this.encrypt.encrypt(JSON.stringify(req.body))
    });
    return next.handle(req).pipe(map((resp : HttpEvent<any>)=>{
      if(resp instanceof HttpResponse)
      return  resp.clone({ body : this.encrypt.decrypt(resp.body)});
      return resp;
    }),
    catchError((error: HttpErrorResponse) => {
      console.log(req.headers)
      return of(new HttpResponse({ body: this.encrypt.Errordecrypt(req.body), status: 0 }));
  }));
    }else{
    return next.handle(req);
    }
  }
}
