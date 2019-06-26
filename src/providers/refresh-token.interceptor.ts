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

    // alert("here token");
    // alert(localStorage.getItem('reefdfdfvcvcmakady'));
    return next.handle(request).catch((errorResponse: HttpErrorResponse) => {
      const error = (typeof errorResponse.error !== 'object') ? JSON.parse(errorResponse.error) : errorResponse;
      //alert(JSON.stringify(errorResponse.url))
      if ( errorResponse.url == this.helper.serviceurl +"user_login") {
        return Observable.throw(errorResponse);
      }
      else if (errorResponse.status === 401 && errorResponse.url != this.helper.serviceurl +'refreshToken') {
        // alert("get token");
    // alert(localStorage.getItem('reefdfdfvcvcmakady'));
        
        const http = this.injector.get(HttpClient);
        let headers = new HttpHeaders()
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');//client_credentials
                
        let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcmakady'))
        console.log("localStorage.getItem('reefdfdfvcvcmakady'):..... "+localStorage.getItem('reefdfdfvcvcmakady'));
        
        return http.post<any>(this.helper.serviceurl +'refreshToken', params, { headers: headers })
          .flatMap(data => {
            console.log("returned data:"+JSON.stringify(data));
            localStorage.setItem('kdkvfkhggssomakady', data.access_token)
            localStorage.setItem('reefdfdfvcvcmakady', data.refresh_token)
            const cloneRequest = request.clone({setHeaders: {'Authorization': 'Bearer ${data.access_token}'}});
            
            // alert(data.refresh_token);
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

    //     this.provider.logout(1,data => {       
    //     this.userLoged = false;
    //     this.storage.remove("Makadyusername");
    //     this.storage.remove("Mlanguage");

    //     this.storage.remove("Makadyuser_name");
    //     this.storage.remove("makadyaccess");
    //     localStorage.clear();
        
    //     this.storage.remove("user_info");
    //     let nav = this.app.getActiveNav();
    //     alert(nav);
    //     nav.setRoot(LoginPage);
    
    //   console.log(JSON.stringify(data))
    // },error => {})

        return;
      }
      else{
        return Observable.throw(errorResponse);
      }
    });

  }
}