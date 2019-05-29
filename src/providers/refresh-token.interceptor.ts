import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
//import { environment } from './../../environments/environment';
import { HelperProvider } from './helper/helper';
//import { HelperProvider } from '../helper/helper';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from './mainprovider/mainprovider';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  constructor(  public helper: HelperProvider, private injector: Injector, public storage: Storage, 
                public provider:MainproviderProvider ) {
    
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // alert("here token")
    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      //alert(JSON.stringify(errorResponse.url))
      if ( errorResponse.url == this.helper.serviceurl +"user_login") {
        return Observable.throw(errorResponse);
    }
     else if (errorResponse.status === 401 && errorResponse.url != this.helper.serviceurl +'refreshToken') {
      alert("here token");
        const http = this.injector.get(HttpClient);
        let headers = new HttpHeaders()
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
                
        let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcmakady'))
        return http.post<any>(this.helper.serviceurl +'refreshToken', params, { headers: headers })
          .flatMap(data => {
            console.log("returned data:"+JSON.stringify(data));
            localStorage.setItem('kdkvfkhggssomakady', data.access_token)
            localStorage.setItem('reefdfdfvcvcmakady', data.refresh_token)
            const cloneRequest = request.clone({setHeaders: {'Authorization': 'Bearer ${data.access_token}'}});
            return next.handle(cloneRequest);
          })
          .catch( err => {
            console.log("errorr here");
            return Observable.throw(errorResponse);
          })
      }
      else if (errorResponse.status === 401  && errorResponse.url == this.helper.serviceurl +'refreshToken'){
        // alert("hereeeee");
        this.helper.out();
        return;
      }
      else{
        return Observable.throw(errorResponse);
      }
    });

  }
}