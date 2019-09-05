import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { environment } from './../../environments/environment';
import { HelperProvider } from './helper/helper';
//import { HelperProvider } from '../helper/helper';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';
import { MainproviderProvider } from './mainprovider/mainprovider';
import { LoginPage } from '../pages/login/login';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  userLoged: boolean = false;
  constructor(  public helper: HelperProvider, private injector: Injector, public storage: Storage, 
                public provider:MainproviderProvider,
                public app:App ) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //alert("here token")
    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      //alert(JSON.stringify(errorResponse.url))
      if ( errorResponse.url == this.helper.serviceurl+`user_login`) {
        return Observable.throw(errorResponse);
    }
     else if (errorResponse.status === 401 && errorResponse.url != this.helper.serviceurl+`refreshToken`) {
        
        const http = this.injector.get(HttpClient);
        let headers = new HttpHeaders()
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
                
        // let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcmakady'))

        let params = new HttpParams().set('refresh_token',"def502006743f6d0cffca958740bc52e556dbcd937d1591868a02c5d220771ccf6099a698f8cf891a92ec3fee8e6ecf1bf8f6c164ecfd7fa8bb1fef92f8316f96be52a7575c51dfe255c3ce6416bc59ebebda3b60a5097811b9c29674e5e4557886e3bd916946590cbc29dbf53108303c7e9a0b862244cab9891eb62515cd5a9a328de8a541362f19a20a3b120e7d6a5132bb99327cd2384614e3317b2e7b6666de2403752bdb5feee9cc60b6f9760983b7ef904f12c101a1f79b816193a19a6fac2d0ea54710534aa8b4c2831e0969e0ad0fa9c7fdd2f05a07ef84533f127b89f24027db872ec38bc802094bea276479e19f370ef991dcbfccc756659aaac29ed3a437dfe63921bbed751164d4c9201f3f60bdd1073398d335d40a39844f273751f493d5fbc4a56cc216c61eb48caba1d3e7db3dafce85c42a151d4bf2aeb45a3d5eb6782fe1db71bae9303993790151334e51dc2df2c022d1a7e11bd6dac90")

        // let params = {
        //   'refresh_token': "def502006743f6d0cffca958740bc52e556dbcd937d1591868a02c5d220771ccf6099a698f8cf891a92ec3fee8e6ecf1bf8f6c164ecfd7fa8bb1fef92f8316f96be52a7575c51dfe255c3ce6416bc59ebebda3b60a5097811b9c29674e5e4557886e3bd916946590cbc29dbf53108303c7e9a0b862244cab9891eb62515cd5a9a328de8a541362f19a20a3b120e7d6a5132bb99327cd2384614e3317b2e7b6666de2403752bdb5feee9cc60b6f9760983b7ef904f12c101a1f79b816193a19a6fac2d0ea54710534aa8b4c2831e0969e0ad0fa9c7fdd2f05a07ef84533f127b89f24027db872ec38bc802094bea276479e19f370ef991dcbfccc756659aaac29ed3a437dfe63921bbed751164d4c9201f3f60bdd1073398d335d40a39844f273751f493d5fbc4a56cc216c61eb48caba1d3e7db3dafce85c42a151d4bf2aeb45a3d5eb6782fe1db71bae9303993790151334e51dc2df2c022d1a7e11bd6dac90" 
        //   // localStorage.getItem('reefdfdfvcvcmakady')
        // }

        return http.post<any>(this.helper.serviceurl+`refreshToken`, params, { headers: headers })
          .map(data => {
            alert(JSON.stringify(data));
            localStorage.setItem('user_token', data.access_token)
            localStorage.setItem('reefdfdfvcvcmakady', data.refresh_token)
            const cloneRequest = request.clone({setHeaders: {'Authorization': `Bearer ${data.access_token}`}});
            return next.handle(cloneRequest);     
          })
          .catch( err => {
            this.helper.out()
            return Observable.throw(errorResponse);
          })
      }
      else if (errorResponse.status === 401  && errorResponse.url == this.helper.serviceurl+`api/refresh`){
        this.helper.out()
        return;
      }
      else{
        return Observable.throw(errorResponse);
      }
    });

  }
}