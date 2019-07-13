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
         headers = headers.set('Content-Type', 'application/x-www-form-urlencoded')
                    .set('Authorization', "Bearer "+ localStorage.getItem('reefdfdfvcvcmakady'));//client_credentials

                
        let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcmakady'))


        // let params = {
        //   'refresh_token': localStorage.getItem('reefdfdfvcvcmakady')
        // }

        // let params = new HttpParams().set('refresh_token', "def502001d86ab5d3540da20246acd34b6f6f2509069d76dde73060a31eb77c7d9e97a72e6d31e124807d3ff1d0e2a9a293ae3ada11ae2b76ff99cfc933247e3e1fb6d78d364e3d525bba22b3ace3b400ab8c5bb43f2669420381bbf5bea838f4187b2c85ce5efb068418613d4ec51ad023812831ba95ea4f7867e745b34cc693a3bdcc7d34592645efbf6edfd452e4126223ec3485d1f8d24dd4d756467cdd4082855d91b3ae1439115cf18583ddc6b8a0fc7cb29dc3eadb37dd24c6a87eec51091b547bfc4882e174abe7af776604d143f2209bc870068e0c3aa3d13c661043b46cec05df7de3bc223a160b815c9e46a8e9445b7917c812a324b47b410347976a8547098b4da88c5163614cb40dfc6406f36dabc5c78e7c73c11ad81d3200758212845580b886933ccab40e25f80774033a3fa608953a689c9d480f230cb66c05d9b26ff593b5d79c89781d9c49c3ae93404918f6a01610a03458b92cb51b2")

        // let params = {
        //   'refresh_token': "def502005fd926631da92f8d3defefd9f49653c6952e2dee92f42bbe3b9fdb92a751d58342b857a70a01d12eaba29d3ffc5108d19503f416a20b91e51b6bb07bba1db2e9d6605bc0363eb6f2cc5ccc7ee8f3776502d9d9275c883e25dd0bdf7db89fcbe03a2c166d099f40a5a379c93b4926e534822fe7363f3a46b2d14c48a8a1fc38fbccf511c6866fa64003e605516ce11a38faa1121599673537382626a752f41dbce5de679946c849d595948116a547cc6f3dacfed44bb0193a0856e343b2ce39715b5ec00503d8287abbcdee4670fc7ac7e172508ebaa11885f8740ea8073c243dccd3517605e41f74ba99ad95f5cf029bc4dfd9c6e5ee09918756670e25d24f11c999a800916fc6d0539d0c541b54a92c8fbb1df4b6e402ecab1049f56277cb09bd124882448fc73356069786537e336c41483e382980c9dac23b2419e24d64a0d69013539945d3e99001c8f33e43888457a9276da67f8d5e4ae5eda6"
        // }
         
        console.log("localStorage.getItem('reefdfdfvcvcmakady'):..... "+localStorage.getItem('reefdfdfvcvcmakady'));
 
        return http.post<any>(this.helper.serviceurl +'refreshToken', params, { headers: headers })
          .flatMap(data => {
            // alert(data);
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

        // return http.post<any>(this.helper.serviceurl +'refreshToken', params, { headers: headers })
        //   .flatMap(data => {
        //     alert(data);
        //     console.log("returned data:"+JSON.stringify(data));
        //     localStorage.setItem('kdkvfkhggssomakady', data.access_token)
        //     localStorage.setItem('reefdfdfvcvcmakady', data.refresh_token)
        //     const cloneRequest = request.clone({setHeaders: {'Authorization': 'Bearer ${data.access_token}'}});
            
        //     // alert(data.refresh_token);
        //     return next.handle(cloneRequest);
        //   })
        //   .catch( err => {
        //     console.log("errorr here");
        //     return Observable.throw(errorResponse);
        //   })


      }
    //   else if (errorResponse.status === 401  && errorResponse.url == this.helper.serviceurl +'refreshToken'){
    //     // alert("hereeeee");
    //     // this.helper.out();

    // //     this.provider.logout(1,data => {       
    // //     this.userLoged = false;
    // //     this.storage.remove("Makadyusername");
    // //     this.storage.remove("Mlanguage");

    // //     this.storage.remove("Makadyuser_name");
    // //     this.storage.remove("makadyaccess");
    // //     localStorage.clear();
        
    // //     this.storage.remove("user_info");
    // //     let nav = this.app.getActiveNav();
    // //     alert(nav);
    // //     nav.setRoot(LoginPage);
    
    // //   console.log(JSON.stringify(data))
    // // },error => {})

    //     return;
    //   }
    //   else{
    //     return Observable.throw(errorResponse);
    //   }
    });
  }
}