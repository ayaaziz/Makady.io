import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, Events } from 'ionic-angular';

@Injectable()
export class HelperProvider {
  langdirection:any="ltr";
  accesstoken:any
  type:any;
  user_id;
  prodNotification:boolean;
  offersNotification:boolean;
  
  serviceurl:any="http://itrootsdemos.com/makady/phase1/api/";
  userImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/users/";
  productImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/products/";

  constructor(public toastCtrl:ToastController, 
              public http: HttpClient,
              public event:Events) {
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
      duration: 4000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "OK",
    });
    toast.present();
  }

  //check matching between codes
  verifyAccount(userCode:string,emailcode:string) {   
    if(userCode === emailcode) {
      return true;
    } else {
        return false;
    }
  }

}
