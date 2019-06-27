import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, ViewController } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  langdirection:any
  current:any=""
  confirm:any=""
  new:any=""
  constructor(public ViewCtrl:ViewController,public toastCtrl:ToastController,public translate:TranslateService,public storage:Storage,public platform:Platform,public provider:MainproviderProvider,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.langdirection=this.helper.langdirection;    
  }

  ionViewDidLoad() {

  }
  
  change()
  {
    if(this.confirm=="" || this.current=="" || this.new=="" )
    {
      this.presentToast(this.translate.instant('alldata'))

    }
    // else if(!(this.new==this.confirm))
    // {
    //   this.presentToast(this.translate.instant('dontmatch'))

    // }
    else{
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.checkpass(this.current,val,(data)=>{
          console.log(JSON.stringify(data));
          let dataparsed=JSON.parse(data);

          if(dataparsed.success==false) {
            this.presentToast(this.translate.instant("incorrectOld"));
          } else if(this.new.length < 4 || this.confirm.length < 4) {
            this.presentToast(this.translate.instant('pwdLength'));
          } else if(!(this.new==this.confirm)) {
              this.presentToast(this.translate.instant('dontmatch'));
          }
          else {
            this.provider.changepass(this.current,this.new,this.confirm,val,(data)=>{
              console.log(JSON.stringify(data))
              this.current=""
              this.new=""
              this.confirm=""
              this.presentToast(this.translate.instant('changed'))

            },(data)=>{})
          }
        },(data)=>{

        })

      }
    })
  }
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

  doRefresh(event) {

    console.log("eventtt: "+event);

    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    });
  }
}
