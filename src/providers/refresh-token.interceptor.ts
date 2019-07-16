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
                    .set('Authorization', "Bearer def50200a59c80daed09b7d0743f6e4b86879962f8f0545a64c79650caf0a1e9d3b1520853591efc37533d900503d5a7297c56b1a97b919a213d447d2e321f28353f49af43baa52a910ecd4b82e83d34c6e5a53c5d68aa3f3f853e532692e2d02aab0de83d9093735d29b2527df5c5f8604cf222f034f2dd38c8421bd0c925579e5fd4d3b42233c54cde47ddef739e4f779fc1e1730cd89683ef59aacd01e35586ada2d1d2bea0f48ebaa183d2db09613657f68fe3e195badf914c2009be3efdb37fcc56f16831525a0f080f8231655ee7487b40ad177b69e7da0fc91114563a8dec4a9cc59a630e49caac1ec5f2fba15607c44eb899fa8faeb076035e229433fa7110c9b46af156f547201f8d5cde376d2966b6d2c9e621c1b3cf202689274203434ba0fb46292320340de895898053c1d801647c7ef402c18312e9492cdbb7460b876b250b1d6aab7f76c3bd35d53a00c58a0c6c82670a8717a1b67173fe3b");//client_credentials

                
        // let params = new HttpParams().set('refresh_token', localStorage.getItem('reefdfdfvcvcmakady'))


        // let params = {
        //   'refresh_token': localStorage.getItem('reefdfdfvcvcmakady')
        // }

        let params = new HttpParams().set('refresh_token', "def50200a59c80daed09b7d0743f6e4b86879962f8f0545a64c79650caf0a1e9d3b1520853591efc37533d900503d5a7297c56b1a97b919a213d447d2e321f28353f49af43baa52a910ecd4b82e83d34c6e5a53c5d68aa3f3f853e532692e2d02aab0de83d9093735d29b2527df5c5f8604cf222f034f2dd38c8421bd0c925579e5fd4d3b42233c54cde47ddef739e4f779fc1e1730cd89683ef59aacd01e35586ada2d1d2bea0f48ebaa183d2db09613657f68fe3e195badf914c2009be3efdb37fcc56f16831525a0f080f8231655ee7487b40ad177b69e7da0fc91114563a8dec4a9cc59a630e49caac1ec5f2fba15607c44eb899fa8faeb076035e229433fa7110c9b46af156f547201f8d5cde376d2966b6d2c9e621c1b3cf202689274203434ba0fb46292320340de895898053c1d801647c7ef402c18312e9492cdbb7460b876b250b1d6aab7f76c3bd35d53a00c58a0c6c82670a8717a1b67173fe3b")

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