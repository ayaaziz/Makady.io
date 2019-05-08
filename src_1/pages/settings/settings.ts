import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  langdirection:any
  name:any
  photo:any
  createdCode:any
  constructor(public ViewCtrl:ViewController,public socialSharing:SocialSharing,public plt:Platform,public inap:InAppBrowser,public storage:Storage,public platform:Platform,public provider:MainproviderProvider,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    this.langdirection=this.helper.langdirection

  }
  getimg()
  {

  }
  ionViewDidLoad() {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.getuser(val,(data)=>{
      console.log(JSON.stringify(data))
      let Dataparsed=JSON.parse(data)
      if(Dataparsed.success==true)
      {
       this.createdCode=(Dataparsed.user.id).toString()
        console.log(this.createdCode)
      } 
    },(data)=>{})
  }
})
    this.storage.get("Makadyuser_name").then((val)=>{
      this.name=val
    })

    console.log('ionViewDidLoad SettingsPage');
  }
  changelang()
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    if(this.helper.langdirection=="ltr")
    {
      this.provider.changelang(2,val,(data)=>{
        console.log(JSON.stringify(data))
        this.translate.setDefaultLang('ar');  
        this.translate.use('ar');    
        this.platform.setDir('rtl', true);
        this.helper.langdirection = "rtl"; 
        
      },(data)=>{})
    }
    else{
      this.provider.changelang(1,val,(data)=>{
        console.log(JSON.stringify(data))
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.platform.setDir('ltr', true);
        this.helper.langdirection = "ltr";
      },(data)=>{})
    }
  }
})
  }
  changepass()
  {
    this.navCtrl.push(ChangepasswordPage)
  }
  opentwitter()
  {
    
   this.inap.create('https://twitter.com/makady', '_system', 'location=yes');

  }
  openinsta()
  {
   
   this.inap.create('https://www.instagram.com/makady/', '_system', 'location=yes');

  }
  openfacebook()
  {
   
   this.inap.create('https://www.facebook.com/makady', '_system', 'location=yes');

  }
  shareapp()
{

  if (this.plt.is('ios')) {
  this.socialSharing.share("مقاضي" , null , null ,"").then(() => {
    console.log("success")
  }).catch(() => {
    console.log("not available")
  });
}
else{
  this.socialSharing.share("مقاضي" , null , null ,"").then(() => {
    console.log("success")
  }).catch(() => {
    console.log("not available")
  });
}
}
}
