import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = environment.Auth_url;
  constructor(private http:HttpClient) { }

  Authentication(){
    const raw = {
      fiuID: 'STERLING-FIU-UAT',
      redirection_key: 'DSTKnxbUAlPukv',
      userId: 'athira.j@camsonline.com'
    }
    let requestHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.authUrl+'/api/FIU/Authentication',raw, { headers:requestHeaders });
  }

  Redirection(data:any){
    let requestHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', `Bearer ${sessionStorage.getItem('token')}`);
    return this.http.post(this.authUrl+'/api/FIU/RedirectAA',data, { headers:requestHeaders }); 
  }
}
