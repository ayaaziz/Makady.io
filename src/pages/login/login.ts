import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelperProvider } from '../../providers/helper/helper';
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { ForgetpasswordPage } from '../forgetpassword/forgetpassword';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';

import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  remember: any
  langdirection: any
  logInForm: FormGroup;
  username: any = ""
  Password: any = ""
  constructor(private googlePlus: GooglePlus,public provider: MainproviderProvider,public event: Events, public storage: Storage, public toastCtrl: ToastController, public helper: HelperProvider, public formBuilder: FormBuilder, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {

    this.langdirection = this.helper.langdirection
    console.log("langdirection from login : ",this.langdirection)
  }

  ionViewDidLoad() {

  }
  opensign() {
    this.navCtrl.push(SignupPage)
  }
  login() {
    if (this.username == "" || this.Password == "") {
      this.presentToast(this.translate.instant('alldata'))
    }


    else {
      // put in login api success


      this.provider.login(this.username, this.Password, "fdgdgdg66553rhask", (data) => {
        console.log(JSON.stringify(data))
        let Dataparsed = JSON.parse(data)
        if (Dataparsed.success == false) {
          this.presentToast('خطأ في اسم المستخدم أو كلمة المرور')
        }
        else {
          this.provider.getuser(Dataparsed.access_token, (data) => {
            this.navCtrl.setRoot(TabsPage)
            let pdata = JSON.parse(data)
            this.storage.set("user_info", pdata)
            this.storage.set("makadyaccess", Dataparsed.access_token)
            this.helper.accesstoken = Dataparsed.access_token
            console.log(this.helper.accesstoken)
            this.event.publish("login")
            if (this.remember == true) {
              this.storage.set("Makadyusername", "true")
            }
            this.storage.set("Makadyuser_name", this.username)

            this.navCtrl.setRoot(TabsPage)
          },
            (data) => {
              this.presentToast(this.translate.instant('serverErr'))
              this.navCtrl.setRoot(LoginPage)
            })


        }

      }, (data) => {

      })
    }
  }
  forget() {
    this.navCtrl.push(ForgetpasswordPage)
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',

    });
    toast.present();
  }

  googleLogin(){
    console.log("googleLogin ")
    // 651484334747-hg2uqdf63o2vus6er099d4ia6dmgeae2.apps.googleusercontent.com
    // ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=651484334747-hg2uqdf63o2vus6er099d4ia6dmgeae2.apps.googleusercontent.com
    // npm install --save @ionic-native/google-plus@4

//     accessToken: "ya29.GlvDBm-g_1Z1KN3Z_ePZpXSQKfz7s5eINcjHTzOkMDwwmMjjEaVP2F1cr7khqdjkfPokV6QAUMOPJpIaL1yY0xSmCt6LNj1-tbVpGQxAuueRY1TmP8pymSsrJmVY"
// displayName: "itroots net"
// email: "itroots.net@gmail.com"
// expires: 1551804153
// expires_in: 3597
// familyName: "net"
// givenName: "itroots"
// userId: "102929510784780528383"

    this.googlePlus.login({})
  .then(res => console.log("res: ",res))
  .catch(err => console.error("err: ",err));
  }
}
