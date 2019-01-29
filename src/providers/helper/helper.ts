import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class HelperProvider {
  langdirection:any="ltr"
  accesstoken:any
  type:any
  user_id;
  serviceurl:any="http://itrootsdemos.com/makady/phase1/api/"
  constructor(public toastCtrl:ToastController, public http: HttpClient) {
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
      duration: 3000,
      position: 'bottom',
    
    });
    toast.present();
  }
}
