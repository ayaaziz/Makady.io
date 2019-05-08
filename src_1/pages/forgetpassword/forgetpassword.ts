import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ToastController} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { VerificationPage } from '../verification/verification';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';


@Component({
  selector: 'page-forgetpassword',
  templateUrl: 'forgetpassword.html',
})
export class ForgetpasswordPage {
langdirection:any
Email:any=""
emailcode:any
username:any
  constructor(public provider:MainproviderProvider,public helper:HelperProvider,public toastCtrl:ToastController,public translate :TranslateService,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    console.log('ionViewDidLoad ForgetpasswordPage');
  }
send()
{
  if(this.Email=="")
  {
      this.presentToast(this.translate.instant('enteryouremail'))

  }
 
  else{
    this.provider.forgetpass(this.Email,(data)=>{
      console.log(JSON.stringify(data))
      let dataparsed=JSON.parse(data)
      this.username=dataparsed.data.username
      this.emailcode=dataparsed.data.email_code
      console.log(this.emailcode)
      console.log(this.username)
      this.navCtrl.push(VerificationPage,{"username":this.username,"emailcode":this.emailcode})

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