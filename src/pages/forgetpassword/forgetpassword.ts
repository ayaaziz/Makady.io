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
langdirection:any;
Email:any="";
emailcode:any;
username:any;

  constructor(public provider:MainproviderProvider,
              public helper:HelperProvider,
              public toastCtrl:ToastController,
              public translate :TranslateService,
              public navCtrl: NavController,
              public navParams: NavParams) {

              this.langdirection=this.helper.langdirection;
  }

  send() {
    if(this.Email=="") {
      this.helper.presentToast(this.translate.instant('enteryouremail'));

    } else {
      this.provider.forgetpass(this.Email,"forgetPassword",(data) => {
        console.log(JSON.stringify(data));
        let dataparsed = JSON.parse(data);
        this.username = dataparsed.data.username;
        this.emailcode = dataparsed.data.email_code;
        console.log(this.emailcode);
        console.log(this.username);
        this.navCtrl.push(VerificationPage,{"pageType":"forgetPass","username":this.username,"emailcode":this.emailcode});

      },(error)=>{
        console.log(error);
      });
    }
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
