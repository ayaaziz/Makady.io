import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, Events, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';

@Injectable()
export class HelperProvider {
  langdirection:any="ltr";
  accesstoken:any
  type:any;
  user_id;
  prodNotification:boolean;
  offersNotification:boolean;
  userLoged: boolean = false;
  registerationId:string = "fdgdgdg66553rhask";
  
  serviceurl:any="http://itrootsdemos.com/makady/phase1/api/";
  userImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/users/";
  productImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/products/";

  constructor(public toastCtrl:ToastController, 
              public http: HttpClient,
              public storage:Storage,
              public event:Events,
              // private navctrl:NavController
            ) {
    console.log('Hello HelperProvider Provider');

  }
  parseArabic(str) {
    return Number( str.replace(/[٠١٢٣٤٥٦٧٨٩]/g, function(d) {
        return d.charCodeAt(0) - 1632; // Convert Arabic numbers
    }))
}
  presentToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "OK",
    });
    toast.present();
  }

  //check matching between codes
  verifyAccount(userCode:string,emailcode:string) {   
    console.log("userCode",userCode);
    console.log("emailcode",emailcode);
    
    if(userCode == emailcode) {
      return true;
    } else {
        return false;
    }
  }

  out() {
    this.userLoged = false;
    this.storage.remove("Makadyusername");
    this.storage.remove("Mlanguage");

    this.storage.remove("Makadyuser_name");
    this.storage.remove("makadyaccess");
    localStorage.clear();
    
    this.storage.remove("user_info");
    // this.navctrl.setRoot(LoginPage);
  }

}
