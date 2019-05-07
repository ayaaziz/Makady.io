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
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { VerificationPage } from '../verification/verification';
// import { VerificationPage } from '../verification/verification';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  remember: any;
  langdirection: any;
  logInForm: FormGroup;
  username: any = "";
  Password: any = "";

  constructor(
              private googlePlus: GooglePlus,
              public provider: MainproviderProvider,
              public event: Events, 
              public storage: Storage,
              public toastCtrl: ToastController,
              public helper: HelperProvider, 
              public formBuilder: FormBuilder,
              public translate: TranslateService,
              public navCtrl: NavController,
              public navParams: NavParams,
              private twitter: TwitterConnect,
              private fb: Facebook) {

            this.langdirection = this.helper.langdirection;
  }

  opensign() {
    this.navCtrl.push(SignupPage);
  }

  login() {
    if (this.username == "" || this.Password == "") {
      this.helper.presentToast(this.translate.instant('alldata'));
    } else {
        this.provider.login(this.username, this.Password, "fdgdgdg66553rhask", (data) => {
  
          let Dataparsed = JSON.parse(data);
          if (Dataparsed.success == false) {
            this.helper.presentToast('خطأ في اسم المستخدم أو كلمة المرور');
          } else { 
              this.provider.getuser(Dataparsed.access_token, (data) => {
                let pdata = JSON.parse(data);
                console.log("parsed data: "+JSON.stringify(pdata));
         
                // if (this.remember == true) {
                  this.storage.set("Makadyusername", "true");
                // }
                this.storage.set("makadyaccess", Dataparsed.access_token);
                this.helper.accesstoken = Dataparsed.access_token;
                this.storage.set("Makadyuser_name", this.username);

                this.storage.set("user_info", pdata)
                .then(() => {
                  this.event.publish("login");
                });

                // if(data.verified) 
                if(true) { //account verified
                  this.navCtrl.setRoot(TabsPage);

                } else { //not verified
                    // this.navCtrl.push(VerificationPage,{"pageType":"AuthPage","username":pdata.user.username,"userId":pdata.user.id,"emailcode":pdata.user.email_code});                  
                } 
              },
              (error) => {
                console.log(error);
                this.helper.presentToast(this.translate.instant('serverErr'));
                this.navCtrl.setRoot(LoginPage);
              });
          }
      }, (error) => {
        console.log(error);
      });
    }
  }

  // openVerify() {
  //   this.navCtrl.push(VerificationPage);
  // }

  forget() {
    this.navCtrl.push(ForgetpasswordPage);
  }

  facebookLogin() {
    this.fb.login(['public_profile', 'email'])
  .then((res: FacebookLoginResponse) => {
    console.log('Logged into Facebook!', res)
    let userId = res.authResponse.userID;
    let params = new Array<string>();
    this.fb.api("/me?fields=name,gender", params)
      .then(user => {
        console.log("Facebook user ", user)
        this.fb.logout().then(() => {
          console.log("close fb seesion success")
        }).catch(() => {
          console.log("close fb seesion failed");
        })
      })
      .catch(err => console.log("facebook user info error "))
  })
  .catch(e => console.log('Error logging into Facebook', e));

  }

  googleLogin() {
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
    .then(res => {
      console.log("res: ",res)
      this.googlePlus.logout().then(() => {
        console.log("close ggole plus seesion success")
      }).catch(() => {
        console.log("close ggole plus seesion failed");
      })
    })
    .catch(err => console.error("err: ",err));
  }

  //login with twitter socila netwwork.
  doTwLogin() {
    if (navigator.onLine ) {
      let nav = this.navCtrl;

      //Request for login
      this.twitter.login()
      .then(result => {
          console.log("twitter login info " + JSON.stringify(result));
          this.twitter.showUser()
          .then(user => {
              console.log("user info" + JSON.stringify(user));
              //get user gender from twitter response.
              let user_gender = user.gender;
              if (typeof (user_gender) === "undefined" || user_gender === null) {
                user_gender = 0;
              }
              
              console.log("twitter data", user.id, " -", user.name, " -", user.profile_image_url_https);
              //this.loginservice.userLoginWithSocial(user.id, 2, user.name, user.profile_image_url_https, 0, "0000-00-00", (data) => this.socialLoginSuccessCallback(data), (data) => this.socialLoginFailureCallback(data))
              this.twitter.logout().then(() => {
                console.log("clear twitter session success");
              }).catch(() => {
                console.log("clear twitter session failed");
              })
            },
            error => {
              console.log("user info faile " + error);
            }
          )
        },
        error => {
          console.log("twitter login failed " + error)
        }
      );
    }
    else {
      //this.ShowError = false;
    }
  }
}
