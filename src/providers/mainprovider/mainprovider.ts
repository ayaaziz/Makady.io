import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HelperProvider } from '../helper/helper';
import { LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MainproviderProvider {

  constructor(public loadingCtrl:LoadingController,
              public helper:HelperProvider,
              public http: HttpClient,
              public translate:TranslateService) {

    console.log('Hello MainproviderProvider Provider');
  }
 
  signup(username,name,email,password,confirm,phone,pic,ext,
        social_type,id,type,lang, successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':username,
        'name': name,
        'email': email,
        'password':password,
        'password_confirmation':confirm,
        'phone': phone,
        'profile_pic':pic,
        'profile_pic_ext': ext,
        'social_type':social_type,
        'firebase_id':id,
        'type':this.helper.type,
        'lang':lang
      }
      headers = headers.set('Content-Type', 'application/json');
      let serviceUrl = this.helper.serviceurl + 'user_register';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);

            console.log("errrrrror::::: "+ err);
            if(err == "TimeoutError") {
                  if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }  
            }
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  login(username,password,id,successCallback, failureCallback) {
  
    if(navigator.onLine) {

      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        "username":username,
        "password":password,
        "firebase_id":id
      }
      headers = headers.set('Content-Type', 'application/json');
                        // .set('Access-Control-Allow-Origin',"*");
      let serviceUrl = this.helper.serviceurl + "user_login";
      
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();
           
            console.log(data);
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
 
            if(err.name == "TimeoutError") {
              this.helper.presentToast(this.translate.instant("timeoutError"));
            }         
          }
        )
    } else {    
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //return emailcode
  forgetpass(email,requestType,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'email':email,
        'type':requestType
      }

      headers = headers.set('Content-Type', 'application/json');
      let serviceUrl = this.helper.serviceurl + 'forgetPassword';
    
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {

            loader.dismiss();

            failureCallback(err);
            if(err.name == "TimeoutError") {
              this.helper.presentToast(this.translate.instant("timeoutError"));
            }         
          }
        )
      } else {
        this.helper.presentToast(this.translate.instant("offline"));
      }
  }

  updatepass(username,emailcode,password,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':username,
        'email_code':emailcode,
        'password':password
      
      }
      headers = headers.set('Content-Type', 'application/json');
      let serviceUrl = this.helper.serviceurl + 'updateForgetPassword';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            if(err.name == "TimeoutError") {
              this.helper.presentToast(this.translate.instant("timeoutError"));
            }  
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  logout(search,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'search':search,
      
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'logoutDevice';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);        
            if(err.name == "TimeoutError") {       
              this.helper.presentToast(this.translate.instant("timeoutError"));          
            }       
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  // getRefreshToken(successCallback, failureCallback) {

  //   if(navigator.onLine) {
  //     let loader = this.loadingCtrl.create({
  //       content: "",
  //     });
  //     loader.present();
  //     let headers = new HttpHeaders();
  //     let parameter = {
  //       'refresh_token': "def502005fd926631da92f8d3defefd9f49653c6952e2dee92f42bbe3b9fdb92a751d58342b857a70a01d12eaba29d3ffc5108d19503f416a20b91e51b6bb07bba1db2e9d6605bc0363eb6f2cc5ccc7ee8f3776502d9d9275c883e25dd0bdf7db89fcbe03a2c166d099f40a5a379c93b4926e534822fe7363f3a46b2d14c48a8a1fc38fbccf511c6866fa64003e605516ce11a38faa1121599673537382626a752f41dbce5de679946c849d595948116a547cc6f3dacfed44bb0193a0856e343b2ce39715b5ec00503d8287abbcdee4670fc7ac7e172508ebaa11885f8740ea8073c243dccd3517605e41f74ba99ad95f5cf029bc4dfd9c6e5ee09918756670e25d24f11c999a800916fc6d0539d0c541b54a92c8fbb1df4b6e402ecab1049f56277cb09bd124882448fc73356069786537e336c41483e382980c9dac23b2419e24d64a0d69013539945d3e99001c8f33e43888457a9276da67f8d5e4ae5eda6"       
  //     }

  //     headers = headers.set('Authorization',"Bearer def502005fd926631da92f8d3defefd9f49653c6952e2dee92f42bbe3b9fdb92a751d58342b857a70a01d12eaba29d3ffc5108d19503f416a20b91e51b6bb07bba1db2e9d6605bc0363eb6f2cc5ccc7ee8f3776502d9d9275c883e25dd0bdf7db89fcbe03a2c166d099f40a5a379c93b4926e534822fe7363f3a46b2d14c48a8a1fc38fbccf511c6866fa64003e605516ce11a38faa1121599673537382626a752f41dbce5de679946c849d595948116a547cc6f3dacfed44bb0193a0856e343b2ce39715b5ec00503d8287abbcdee4670fc7ac7e172508ebaa11885f8740ea8073c243dccd3517605e41f74ba99ad95f5cf029bc4dfd9c6e5ee09918756670e25d24f11c999a800916fc6d0539d0c541b54a92c8fbb1df4b6e402ecab1049f56277cb09bd124882448fc73356069786537e336c41483e382980c9dac23b2419e24d64a0d69013539945d3e99001c8f33e43888457a9276da67f8d5e4ae5eda6");
  //     let serviceUrl = this.helper.serviceurl + 'refreshToken';

  //     this.http.post(serviceUrl, parameter, { headers: headers })
  //       .subscribe(
  //         data => {
  //           loader.dismiss();
  //           successCallback(JSON.stringify(data));
  //         },
  //         err => {
  //           loader.dismiss();
  //           failureCallback(err);        
  //           console.log(err.message);     
  //         }
  //       )
  //   } else {
  //     this.helper.presentToast(this.translate.instant("offline"));
  //   }
  // }



  // changelang(lang,successCallback, failureCallback) {
  //   let loader = this.loadingCtrl.create({
  //     content: "",
  //   });
  //   loader.present();
  //   let headers = new HttpHeaders();
  //   let parameter = {
  //     'lang':lang     
  //   }
  //   headers = headers.set('Authorization', 'Bearer '+access);
  //   let serviceUrl = this.helper.serviceurl + 'changeLanguage';
  //   //
  //   this.http.post(serviceUrl, parameter, { headers: headers })
  //     .subscribe(
  //       data => {
  //         loader.dismiss();

  //         successCallback(JSON.stringify(data))
  //       },
  //       err => {
  //         loader.dismiss();

  //         failureCallback(err);
  //       }
  //     )
  // }


  checkpass(pass,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'current_password':pass,
      
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'checkPassword';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
      .subscribe(
        data => {
          loader.dismiss();

          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
              if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
        })
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  changepass(pass,newpass,confirm,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'current_password':pass,
        'password':newpass,
        'password_confirmation':confirm
      
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'changePassword';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  getuser(successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'getUser';
      //
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  products(successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'categories';
      //
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  getproducts(id,search,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'category_id':id,
        'search':search
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'getCategoryProducts';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)  
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
              if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
        }
      )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  offers(search,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    let parameter={
      'search':search
    }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'offers';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  friends(successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'friends';
    
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  deletefriends(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'deleteFriend';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  addfriends(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'addFriend';
    
      this.http.post(serviceUrl, parameter,{ headers: headers })
      // .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            // failureCallback(err);
            // if(err.name == "TimeoutError") {       
                    // this.helper.presentToast(this.translate.instant("timeoutError"));        
                  //  }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  deletegroups(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'group_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'deleteGroup';
  
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }              
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  searchgroups(name,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':name
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'searchGroup';
    
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  creategroup(name,ids,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name_en':name,
        'users_ids':ids
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'createGroup';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  editgroup(name,ids,removedIds,groupid,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name_en':name,
        'users_ids':ids,
        "removed_ids":removedIds,
        'group_id':groupid
      }
 
      console.log(parameter)
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'editGroup';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  menus(type,search,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'type':type,
        'search':search,
      
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'menus';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  deletemenu(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'menu_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'deleteMenu';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  addtomenu(id,products,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'menu_id':id,
        'products':JSON.stringify(products)
      }
      console.log(parameter)
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'addMenuProduct';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  home(successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      headers = headers.set('Authorization','Bearer '+ localStorage.getItem('kdkvfkhggssomakady'));
                        // .set('Access-Control-Allow-Origin',"*");
      let serviceUrl = this.helper.serviceurl + 'home';
      //
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  friendrequests(successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      headers = headers.set('Authorization', 'Bearer '+ localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'getFriendRequest';
      //
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  acceptfriendrequests(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'acceptFriendRequest';
     
      this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }        
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  //////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx///////
  updateproduct(id,quantity,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      // alert(quantity)
      let parameter={
        'id':id,
        'quantity':quantity
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'updateMenuProduct';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getMenudetails(id,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'menu_id':id,
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'getMenu';
   
      this.http.post(serviceUrl,parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }             
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  createmenu(name,ids,successCallback, failureCallback) {
    
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        // 'name':name,
        "name_en":name,
        'users_ids':ids
      }

    console.log(parameter)
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'createMenu';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  editmenu(name,ids,removedIds,menuid,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'name_en':name,
        'users_ids':ids,
        'removed_ids':removedIds,
        'menu_id':menuid
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'editMenu';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

 
  addproduct(id,useid,quantity,price,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'menu_item_id':id,
        'user_id':useid,
        'quantity':quantity,
        'price':price,
        'date':new Date()
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'addMenuUserProduct';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(data)
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  // *****************************New Apis*************************//
  
  //api name: "getProductByBarCode"
  searchProdByBarCode(categoryId,prodBarCode,successCallback,failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'category_id':categoryId,
        'barcode':prodBarCode
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'getProductByBarCode';

      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(data => {
            loader.dismiss();
            successCallback(data);
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }           
          });

    } else {
      this.helper.presentToast(this.translate.instant("offline"));      
    }
  }

  // searchProductByName(categoryId,prodBarCode,successCallback,failureCallback) {
  //   if(navigator.onLine) {
  //     let loader = this.loadingCtrl.create({
  //       content: "",
  //     });
  //     loader.present();
  //     let headers = new HttpHeaders();
  //     let parameter = {
  //       'category_id':categoryId,
  //       'barcode':prodBarCode
  //     }
  //     headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
  //     let serviceUrl = this.helper.serviceurl + 'getProductByBarCode';

  //     this.http.post(serviceUrl, parameter,{ headers: headers })
  //       .subscribe(data => {
  //           loader.dismiss();
  //           successCallback(data);
  //         },
  //         err => {
  //           loader.dismiss();
  //           failureCallback(err);
  //           console.log(err.message);         
  //         });

  //   } else {
  //     this.helper.presentToast(this.translate.instant("offline"));      
  //   }
  // }

  changeProfilePicture(pic,ext,successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        "profile_pic":pic,
        "profile_pic_ext":ext
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'changeProfilePic';

      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(data => {
            loader.dismiss();
            successCallback(data);
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }        
          });

    } else {
      this.helper.presentToast(this.translate.instant("offline"));      
    }
  }

  //api name: "updateVerificationStatus"
  setVerified(successCallback,failureCallback) {
  
    if(navigator.onLine) {
      let spinner = this.loadingCtrl.create();
      spinner.present();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));

      let parameter = {
        //must add "verified" column in db 
        'verified':1
      }
      let serviceUrl = this.helper.serviceurl + 'updateVerificationStatus';

      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)        
      .subscribe(
        data => {
          spinner.dismiss();

          successCallback(JSON.stringify(data))
        },
        err => {
          spinner.dismiss();

          failureCallback(err);
              if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }   
        });

      // //test
      // return true;

    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //api name: "notificationStatus"
  //tell server if product notifications/offers notification opened or closed
  notificationStatus(userId,notificationType,statusNo,successCallback,failureCallback) {

    if(navigator.onLine) {
      let spinner = this.loadingCtrl.create();
      spinner.present();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));

      let parameter = {
        "user_id":userId,
        "notification_type":notificationType,
        'status':statusNo
      }

      let serviceUrl = this.helper.serviceurl + 'notificationStatus';
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
      .subscribe(data => {
          spinner.dismiss();
          successCallback(data);
        },
        err => {
          spinner.dismiss();
          failureCallback(err);
              if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }          
        });
  

        
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //api name: "searchFriends" (ask esraa)
  searchFriends(searchTxt,successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':searchTxt
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'searchFriend';

      this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)        
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data));
        },
        err => {
          loader.dismiss();
          failureCallback(err);
              if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
        }
      )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  // //api name: "social_login"
  // userLoginWithSocial(id,socialType,name,email,lang,profileImageUrl,gender,phone,successCallback,failureCallback) {

  //   if(navigator.onLine) {
  //     let loader = this.loadingCtrl.create({
  //       content: "",
  //     });
  //     loader.present();
  //     let headers = new HttpHeaders();
      
  //     let parameter = {
  //       'username':name,
  //       'name': name,
  //       'email': email,
  //       'password':id,
  //       'phone': phone,
  //       'profile_pic':profileImageUrl,
  //       'social_type':socialType,
  //       'lang':lang
  //     }
  //     headers = headers.set('Content-Type', 'application/json');

  //     let serviceUrl = this.helper.serviceurl + 'social_login';

  //     this.http.post(serviceUrl,parameter, { headers: headers })
  //     .subscribe(
  //       data => {
  //         loader.dismiss();
  //         successCallback(JSON.stringify(data));
  //       },
  //       err => {
  //         loader.dismiss();
  //         failureCallback(err);
  //         console.log(err.message);       
  //       }
  //     )
  //   } else {
  //     this.helper.presentToast(this.translate.instant("offline"));
  //   }
  // }

   //api name: "social_login"
   userLoginWithSocial(id,socialType,name,email,lang,profileImageUrl,gender,phone,successCallback,failureCallback) {
  
    console.log('username '+name,
    'email '+ email,
    'password '+id,
    'lang '+lang,
    'social_type '+socialType);

      if(navigator.onLine) {
        let loader = this.loadingCtrl.create({
          content: "",
        });
        loader.present();
        let headers = new HttpHeaders();

        let parameter = {
          'username':name,
          'email': email,
          // 'password':id,
          'lang':lang,
          'social_type':socialType  ,
          'firebase_id':this.helper.registerationId,
          'type':this.helper.type    
        }
           
        headers = headers.set('Content-Type', 'application/json');

        let serviceUrl = this.helper.serviceurl + 'social_login';

        this.http.post(serviceUrl,parameter, { headers: headers })
      .timeout(10000)          
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            if(err.name == "TimeoutError") {              
              this.helper.presentToast(this.translate.instant("timeoutError"));  
            }                                                   
          }
        )
      } else {
        this.helper.presentToast(this.translate.instant("offline"));
      }
  }

  removeUserFromMenu(menuId,userId,successCallback,failureCallback) {
 
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();

      let headers = new HttpHeaders();
      let parameter = {
        'menu_id':menuId,
        'current_user':userId
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));

      let serviceUrl = this.helper.serviceurl + 'RemoveMenuUser';
 
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }      
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getFriendsNotInMenu(menuId,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      let parameter = {
        "menu_id":menuId
      }
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'FriendsNotInMenu';
    
      this.http.post(serviceUrl, parameter ,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getFriendsInMenu(menuId,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      let parameter = {
        "menu_id":menuId
      }
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'FriendsInMenu';
    
      this.http.post(serviceUrl, parameter ,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getFriendsNotInGroup(groupId,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      let parameter = {
        "group_id":groupId
      }
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'FriendsNotInGroup';
    
      this.http.post(serviceUrl, parameter ,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getFriendsInGroup(groupId,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      let parameter = {
        "group_id":groupId
      }
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'FriendsInGroup';
    
      this.http.post(serviceUrl, parameter ,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }



  ///////new apis/////////
  getRequestsSent(successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'FriendsIRequest';
    
      this.http.get(serviceUrl ,{ headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  cancelReq(userId,successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));

      let parameter = {
        "user_id":userId
      }

      let serviceUrl = this.helper.serviceurl + 'CancelFriendRequest';
    
      this.http.post(serviceUrl, parameter ,{ headers: headers })
      .timeout(10000)  
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }         
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  editProfile(data,image,ext,successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':data.username,
        'name': data.name,
        'email': data.email,
        'phone': data.phone,
        'profile_pic':image,
        'profile_pic_ext': ext
      }
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'EditProfile';
      
      this.http.post(serviceUrl, parameter, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }  
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getSocialLinks(successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
   
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'socialLinks';
      
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }  
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getStores(successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
   
      headers = headers.set('Authorization', 'Bearer '+localStorage.getItem('kdkvfkhggssomakady'));
      let serviceUrl = this.helper.serviceurl + 'Stores';
      
      this.http.get(serviceUrl, { headers: headers })
      .timeout(10000)        
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
                if(err.name == "TimeoutError") {               this.helper.presentToast(this.translate.instant("timeoutError"));             }  
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

}
