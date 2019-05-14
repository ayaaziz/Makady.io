import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HelperProvider } from '../helper/helper';
import { LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';



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
        'type':type,
        'lang':lang
      }
      headers = headers.set('Content-Type', 'application/json');
      let serviceUrl = this.helper.serviceurl + 'user_register';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);
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
        .subscribe(
          data => {
            loader.dismiss();
           
            console.log(data);
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //return emailcode
  forgetpass(username,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'username':username 
      }

      headers = headers.set('Content-Type', 'application/json');
      let serviceUrl = this.helper.serviceurl + 'forgetPassword';
    
      this.http.post(serviceUrl, parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data));
          },
          err => {
            this.helper.presentToast(err.message);

            loader.dismiss();

            failureCallback(err);
            this.helper.presentToast(err.message);            
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
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  logout(search,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'search':search,
      
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'logoutDevice';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data));
          },
          err => {
            loader.dismiss();
            failureCallback(err);        
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  // changelang(lang,access,successCallback, failureCallback) {
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


  checkpass(pass,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'current_password':pass,
      
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'checkPassword';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
      .subscribe(
        data => {
          loader.dismiss();

          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);          
        })
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  changepass(pass,newpass,confirm,access,successCallback, failureCallback) {
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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'checkPassword';
      //
      this.http.post(serviceUrl, parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  getuser(access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'getUser';
      //
      this.http.get(serviceUrl, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  products(access,successCallback, failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'categories';
      //
      this.http.get(serviceUrl, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  getproducts(id,search,access,successCallback, failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'getCategoryProducts';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);          
        }
      )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  offers(search,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    let parameter={
      'search':search
    }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'offers';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  friends(access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
    
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'friends';
    
      this.http.get(serviceUrl, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  deletefriends(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'deleteFriend';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  addfriends(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'addFriend';
    
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  deletegroups(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'group_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'deleteGroup';
  
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  searchgroups(name,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'name':name
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'searchGroup';
    
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  creategroup(name,ids,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name':name,
        'users_ids':ids
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'createGroup';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  editgroup(name,ids,groupid,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name':name,
        'users_ids':ids,
        'group_id':groupid
      }
      console.log(access)
      console.log(parameter)
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'editGroup';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  menus(type,search,access,successCallback, failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'menus';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  deletemenu(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter={
      'menu_id':id
    }
    headers = headers.set('Authorization', 'Bearer '+access);
    let serviceUrl = this.helper.serviceurl + 'deleteMenu';
    //
    this.http.post(serviceUrl, parameter,{ headers: headers })
      .subscribe(
        data => {
          loader.dismiss();

          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);          
        }
      )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  addtomenu(id,products,access,successCallback, failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'addMenuProduct';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  home(access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      headers = headers.set('Authorization', 'Bearer '+access);
                        // .set('Access-Control-Allow-Origin',"*");
      let serviceUrl = this.helper.serviceurl + 'home';
      //
      this.http.get(serviceUrl, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  friendrequests(access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();

      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'getFriendRequest';
      //
      this.http.get(serviceUrl, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  acceptfriendrequests(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'user_id':id
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'acceptFriendRequest';
     
      this.http.post(serviceUrl,parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  //////xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx///////
  updateproduct(id,quantity,access,successCallback, failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'updateMenuProduct';
      //
      this.http.post(serviceUrl,parameter, { headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  getMenudetails(id,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'menu_id':id,
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'getMenu';
   
      this.http.post(serviceUrl,parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();
            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            // this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  createmenu(name,ids,access,successCallback, failureCallback) {
    
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name':name,
        'users_ids':ids
      }

    console.log(parameter)
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'createMenu';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  editmenu(name,ids,menuid,access,successCallback, failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter={
        'name':name,
        'users_ids':ids,
        'menu_id':menuid
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'editMenu';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(JSON.stringify(data))
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

 
  addproduct(id,useid,quantity,price,access,successCallback, failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'addMenuUserProduct';
      //
      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(
          data => {
            loader.dismiss();

            successCallback(data)
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          }
        )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }


  // *****************************New Apis*************************//
  
  //api name: "getProductByBarCode"
  searchProdByBarCode(categoryId,prodBarCode,access,successCallback,failureCallback) {

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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'getProductByBarCode';

      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(data => {
            loader.dismiss();
            successCallback(data);
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          });

    } else {
      this.helper.presentToast(this.translate.instant("offline"));      
    }
  }

  changeProfilePicture(access,pic,ext,successCallback,failureCallback) {
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
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'changeProfilePic';

      this.http.post(serviceUrl, parameter,{ headers: headers })
        .subscribe(data => {
            loader.dismiss();
            successCallback(data);
          },
          err => {
            loader.dismiss();
            failureCallback(err);
            this.helper.presentToast(err.message);            
          });

    } else {
      this.helper.presentToast(this.translate.instant("offline"));      
    }
  }

  //api name: "updateVerificationStatus"
  setVerified(access,successCallback,failureCallback) {
  
    if(navigator.onLine) {
      let spinner = this.loadingCtrl.create();
      spinner.present();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+access);

      let parameter = {
        //must add "verified" column in db 
        'verified':true
      }
      let serviceUrl = this.helper.serviceurl + 'updateVerificationStatus';

      // this.http.post(serviceUrl, parameter, { headers: headers })
      // .subscribe(
      //   data => {
      //     spinner.dismiss();

      //     successCallback(JSON.stringify(data))
      //   },
      //   err => {
      //     spinner.dismiss();

      //     failureCallback(err);
      //     this.helper.presentToast(err.message);   
      //   });

      
      //test
      return true;

    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //api name: "productNotificationStatus"
  //tell server if product notifications opened or closed
  prodNotificationStatus(access,statusNo,successCallback,failureCallback) {

    if(navigator.onLine) {
      let spinner = this.loadingCtrl.create();
      spinner.present();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+access);

      let parameter = {
        'status':statusNo
      }

      let serviceUrl = this.helper.serviceurl + 'productNotificationStatus';
      this.http.post(serviceUrl, parameter,{ headers: headers })
      .subscribe(data => {
          spinner.dismiss();
          successCallback(data);
        },
        err => {
          spinner.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);            
        });
  

    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //api name: "offersNotificationStatus"
  //tell server if offers notifications opened or closed
  offersNotificationStatus(access,statusNo,successCallback,failureCallback) {

    if(navigator.onLine) {
      let spinner = this.loadingCtrl.create();
      spinner.present();

      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer '+access);

      let parameter = {
        'status':statusNo
      }

      let serviceUrl = this.helper.serviceurl + 'offersNotificationStatus';

      this.http.post(serviceUrl, parameter,{ headers: headers })
      .subscribe(data => {
          spinner.dismiss();
          successCallback(data);
        },
        err => {
          spinner.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);            
        });
  
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }

  //api name: "searchFriends" (ask esraa)
  searchFriends(access,searchTxt,successCallback,failureCallback) {
    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      let parameter = {
        'search':searchTxt
      }
      headers = headers.set('Authorization', 'Bearer '+access);
      let serviceUrl = this.helper.serviceurl + 'searchFriend';

      this.http.post(serviceUrl,parameter, { headers: headers })
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data));
        },
        err => {
          loader.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);          
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
  //         this.helper.presentToast(err.message);          
  //       }
  //     )
  //   } else {
  //     this.helper.presentToast(this.translate.instant("offline"));
  //   }
  // }

   //api name: "social_login"
   userLoginWithSocial(id,socialType,name,email,lang,profileImageUrl,gender,phone,successCallback,failureCallback) {

    if(navigator.onLine) {
      let loader = this.loadingCtrl.create({
        content: "",
      });
      loader.present();
      let headers = new HttpHeaders();
      
      // let parameter = {
      //   'username':name,
      //   'name': name,
      //   'email': email,
      //   'password':id,
      //   'lang':lang,
      //   'social_type':socialType,        
      // }

      let parameter = [{
        'username':name,
        'name': name,
        'email': email,
        'password':id,
        'lang':lang,
        'social_type':socialType,        
      }]
      
      headers = headers.set('Content-Type', 'application/json');

      let serviceUrl = this.helper.serviceurl + 'social_login';

      this.http.post(serviceUrl,parameter, { headers: headers })
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data));
        },
        err => {
          loader.dismiss();
          failureCallback(err);
          this.helper.presentToast(err.message);          
        }
      )
    } else {
      this.helper.presentToast(this.translate.instant("offline"));
    }
  }
}
