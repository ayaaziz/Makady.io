import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController, Events, NavController,App, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../../pages/login/login';
import { MainproviderProvider } from '../mainprovider/mainprovider';
import { TranslateService } from '@ngx-translate/core';

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
  scaleClass:any = "";
  
  serviceurl:any="http://itrootsdemos.com/makady/phase1/api/";
  userImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/users/";
  productImagePath:string = "http://itrootsdemos.com/makady/phase1/public/uploads/images/products/";

 public deviceType = ""
  constructor(public toastCtrl:ToastController, 
              public http: HttpClient,
              public storage:Storage,
              public event:Events,
              public app:App,
              public platform:Platform,
              public translate:TranslateService,
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
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: this.translate.instant("OK"),
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
    this.event.publish("out");
  }

  changelang() {
    if(this.langdirection == "ltr")
    {
      this.translate.setDefaultLang('ar');  
      this.translate.use('ar');    
      this.platform.setDir('rtl', true);
      this.langdirection = "rtl"; 
      this.scaleClass="scaleClass";
      this.storage.set('Mlanguage', 'ar').then(resp=>{
        console.log("resp set('language',: ",resp);
      });
    
    } else {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.platform.setDir('ltr', true);
        this.langdirection = "ltr";
        this.storage.set('Mlanguage', 'en').then(resp=>{
          console.log("resp set('language',: ",resp)
        });
    }
  }
}
