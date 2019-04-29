import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { HelperProvider } from '../helper/helper';
import { LoadingController } from 'ionic-angular';


@Injectable()
export class MainproviderProvider {

  constructor(public loadingCtrl:LoadingController,public helper:HelperProvider,public http: HttpClient) {
    console.log('Hello MainproviderProvider Provider');
  }
 
  signup(username,name,email,password,confirm,phone,pic,ext,social_type,id,type,lang, successCallback, failureCallback) {
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
        }
      )
  }

  login(username,password,id,successCallback, failureCallback) {
  
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter = {
      'username':username,
      'password':password,
      'firebase_id':id
      
    }
    headers = headers.set('Content-Type', 'application/json');
    let serviceUrl = this.helper.serviceurl + 'user_login';
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
        }
      )
  }

  //return emailcode
  forgetpass(username,successCallback, failureCallback) {
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
          alert("errrrrrrrrrrrrrrror");
          alert(err.message);

          loader.dismiss();

          failureCallback(err);
        }
      )
  }

  updatepass(username,emailcode,password,successCallback, failureCallback) {
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
        }
      )
  }
  logout(search,access,successCallback, failureCallback) {
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

          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();

          failureCallback(err);
        }
      )
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
        })
  }


  changepass(pass,newpass,confirm,access,successCallback, failureCallback) {
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
        }
      )
  }


  getuser(access,successCallback, failureCallback) {
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
        }
      )
  }

  products(access,successCallback, failureCallback) {
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
        }
      )
  }


  getproducts(id,search,access,successCallback, failureCallback) {
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
        }
      )
  }


  offers(search,access,successCallback, failureCallback) {
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
        }
      )
  }


  friends(access,successCallback, failureCallback) {
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
        }
      )
  }


  deletefriends(id,access,successCallback, failureCallback) {
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
        }
      )
  }


  addfriends(id,access,successCallback, failureCallback) {
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
        }
      )
  }



  deletegroups(id,access,successCallback, failureCallback) {
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
        }
      )
  }



  searchgroups(name,access,successCallback, failureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    let parameter={
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
        }
      )
  }


  creategroup(name,ids,access,successCallback, failureCallback) {
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
        }
      )
  }


  editgroup(name,ids,groupid,access,successCallback, failureCallback) {
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
        }
      )
  }


  menus(type,search,access,successCallback, failureCallback) {
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
        }
      )
  }


  deletemenu(id,access,successCallback, failureCallback) {
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
        }
      )
  }


  addtomenu(id,products,access,successCallback, failureCallback) {
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
        }
      )
  }



  home(access,successCallback, failureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();

    headers = headers.set('Authorization', 'Bearer '+access);
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
        }
      )
  }



  friendrequests(access,successCallback, failureCallback) {
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
        }
      )
  }


  acceptfriendrequests(id,access,successCallback, failureCallback) {
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
        }
      )
  }


  updateproduct(id,quantity,access,successCallback, failureCallback) {
    let loader = this.loadingCtrl.create({
      content: "",
    });
    loader.present();
    let headers = new HttpHeaders();
    alert(quantity)
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
        }
      )
  }


  getMenudetails(id,access,successCallback, failureCallback) {
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
    //
    this.http.post(serviceUrl,parameter,{ headers: headers })
      .subscribe(
        data => {
          loader.dismiss();
          successCallback(JSON.stringify(data))
        },
        err => {
          loader.dismiss();
          failureCallback(err);
        }
      )
  }


  createmenu(name,ids,access,successCallback, failureCallback) {
    
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
        }
      )
  }

  editmenu(name,ids,menuid,access,successCallback, failureCallback) {
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
        }
      )
  }

 
  addproduct(id,useid,quantity,price,access,successCallback, failureCallback) {
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
        }
      )
  }


  setVerified(userId,successCallback,failureCallback) {
    
    let spinner = this.loadingCtrl.create();
    spinner.present();

    let headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    let parameter = {
      'id':userId,
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
    //   });

    
    //test
    return true;
  }



}
