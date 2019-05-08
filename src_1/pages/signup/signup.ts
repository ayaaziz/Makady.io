import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, ToastController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  langdirection:any
  signupform : FormGroup;
  username: any=""
  Password: any=""
  phone: any=""
  name:any=""
  email:any=""
  confirmPassword:any=""
  lang:any
  constructor(public storage:Storage,public provider:MainproviderProvider,public toastCtrl:ToastController,public formBuilder:FormBuilder,public translate:TranslateService,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
   if(this.helper.langdirection=="ltr")
   {
     this.lang="1"
   }
   else{
    this.lang="2"
   }
  
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    console.log('ionViewDidLoad SignupPage');
  }
  login()
  {
   
    this.navCtrl.push(LoginPage)
  }
  signup()
  {
     if(this.phone=="" || this.username=="" || this.Password=="" || this.confirmPassword=="" || this.email==""|| this.name=="")
    {
      this.presentToast(this.translate.instant('alldata'))

    }
    else if(!(this.Password==this.confirmPassword))
    {
      this.presentToast(this.translate.instant('dontmatch'))

    }
    else if(!(this.email.includes('@')|| this.email.includes('.com') || this.email.includes('.net')))
    {
      this.presentToast(this.translate.instant('invalidemail'))

    }
    else if(!(this.phone.length==11))
    {
      this.presentToast(this.translate.instant('invalidphone'))

    }
  
  
    else
    {
      this.provider.signup(this.username,this.name,this.email,this.Password,this.confirmPassword,this.phone,null,null,4,"4rtghju98jhjk","1",this.lang,(data)=>{
       let parsedData=JSON.parse(data)
       console.log(parsedData)
       if(parsedData.success==false)
       {
        this.presentToast(parsedData.errors)
       }
       else{
        this.navCtrl.setRoot(TabsPage)
        this.helper.accesstoken=parsedData.access_token
        this.storage.set("makadyaccess",parsedData.access_token)

       }
      },(data)=>{

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
