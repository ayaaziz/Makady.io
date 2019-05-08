import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { ForgetpasswordPage } from '../forgetpassword/forgetpassword';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  remember:any
  langdirection:any
  logInForm : FormGroup;
  username:any=""
  Password:any=""
  constructor(public provider:MainproviderProvider,public storage:Storage,public toastCtrl:ToastController,public helper:HelperProvider,public formBuilder: FormBuilder,public translate :TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    

  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection

  }
  opensign()
  {
    this.navCtrl.push(SignupPage)
  }
  login()
  {
    if(this.username=="" || this.Password=="")
    {
      this.presentToast(this.translate.instant('alldata'))
    }
    
   
    else{
          // put in login api success

   
    this.provider.login(this.username,this.Password,"fdgdgdg66553rhask",(data)=>{
      console.log(JSON.stringify(data))
      let Dataparsed=JSON.parse(data)
      if(Dataparsed.success==false)
      {
        this.presentToast(Dataparsed.errors)
      }
      else{
        this.storage.set("makadyaccess",Dataparsed.access_token)
        this.helper.accesstoken=Dataparsed.access_token
        console.log(this.helper.accesstoken)
        if(this.remember==true)
      {
        this.storage.set("Makadyusername","true")
      }
      this.storage.set("Makadyuser_name",this.username)

      this.navCtrl.setRoot(TabsPage)
      
      }
      
    },(data)=>{

    })
    }
  }
  forget()
  {
    this.navCtrl.push(ForgetpasswordPage)
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
