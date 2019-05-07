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
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection

  }
  change()
  {
    if(this.confirm=="" || this.current=="" || this.new=="" )
    {
    
      this.presentToast(this.translate.instant('alldata'))

    }
    else if(!(this.new==this.confirm))
    {
      this.presentToast(this.translate.instant('dontmatch'))

    }
    else{
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.checkpass(this.current,val,(data)=>{
          console.log(JSON.stringify(data))
          let dataparsed=JSON.parse(data)
          if(dataparsed.success==false)
          {
            alert("error");            
            this.presentToast(dataparsed.error.password)
          }
          else{
            alert("success");
            console.log("successs");
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

}
