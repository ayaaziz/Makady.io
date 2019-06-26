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
  lang:any;
  hidePassword = true;
  pwdType = "password";
  iconName = "ios-eye-off";
  

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

       
  }

  ionViewWillEnter() {
    this.langdirection = this.helper.langdirection;

    if(this.helper.langdirection == "ltr") {
      this.lang = "1";
    } else { 
       this.lang = "2";
    }
  }

  opensign() {
    this.navCtrl.push(SignupPage);
  }

  login() {
    console.log(this.helper.registerationId);
    
    if (this.username == "" || this.Password == "") {
      this.helper.presentToast(this.translate.instant('alldata'));
    } else {
        this.provider.login(this.username, this.Password,this.helper.registerationId, (data) => {
  
          let Dataparsed = JSON.parse(data);
          

          this.storage.set("makadyaccess", Dataparsed.access_token);
          //set token in localstorage
          localStorage.setItem('kdkvfkhggssomakady', Dataparsed.access_token);
          //set refreshtoken in localstorage
          localStorage.setItem('reefdfdfvcvcmakady',Dataparsed.refresh_token);

          if (Dataparsed.success == false) {
            this.helper.presentToast(this.translate.instant('loginerror'));
          } else { 
              this.provider.getuser(Dataparsed.access_token, (data) => {
                let pdata = JSON.parse(data);
                console.log("parsed data: "+JSON.stringify(pdata));
                console.log("social: "+pdata.user.social_type);
         
                if (this.remember == true) {
                  this.storage.set("Makadyusername", "true");
                }

                this.helper.accesstoken = Dataparsed.access_token;
                this.storage.set("Makadyuser_name", this.username);

                this.storage.set("socialType",pdata.user.social_type);
                
                this.storage.set("user_info", pdata)
                .then(() => {
                  this.event.publish("login");
                });

                if(pdata.user.verified) { //account verified
                  console.log("account verified");
                  this.navCtrl.setRoot(TabsPage);

                } else { //not verified
                    console.log("account not verified");                  
                    this.navCtrl.push(VerificationPage,{"pageType":"AuthPage","username":pdata.user.username,"userId":pdata.user.id,"emailcode":pdata.user.email_code});                  
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

  // //*******************//
  // openVerify() {
  //   this.navCtrl.push(VerificationPage);
  // }
  // //*******************//
  

  forget() {
    this.navCtrl.push(ForgetpasswordPage);
  }

  facebookLogin() {
    this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Facebook user info '+JSON.stringify(res));
        let userId = res.authResponse.userID;
        let accessTokenFromProvider = res.authResponse.accessToken;
        let params = new Array<string>();
        this.fb.api("/me?fields=name,email", params) //get user details
          .then(user => {
            console.log("Facebook user ", user);
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            console.log("Facebook pic ", user.picture);

            
            //**************//
            this.storage.set("socialType",1);
            let facebookUser = {
              "name": user.name,
              "picture": user.picture,
              "email": user.email
            }
            // this.storage.set("facebook_user",facebookUser)
            this.storage.set("user_info",facebookUser)
            .then(() => {
              this.event.publish("login");
              this.navCtrl.setRoot(TabsPage);
            });
            console.log(facebookUser);

            this.storage.set("Makadyusername", "true");
            //api to save in db and return access_token
            // this.provider.userLoginWithSocial(userId,1,user.name,user.email,this.lang,user.picture,0,"0000-00-00",data => {
            this.provider.userLoginWithSocial("1002",1,user.name,user.email,this.lang,user.picture,0,"0000-00-00",data => {            
            console.log('username '+user.name,
            'email '+ user.email,
            'password '+userId,
            'lang '+this.lang,
            'social_type '+1);

              //return with access
              data = JSON.parse(data);

              console.log(data);
              this.storage.set("makadyaccess",data.access_token);   
              //set token in localstorage
              localStorage.setItem('kdkvfkhggssomakady', data.access_token);
              //set refreshtoken in localstorage
              localStorage.setItem('reefdfdfvcvcmakady',data.refresh_token);

              this.provider.getuser(data.access_token,data => {
                this.helper.user_id = data.user.id;

              },error => {
                console.log(error);
              });
            },
            error => {
              console.log(error);
            });
            //**************//

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
    console.log("googleLogin ");
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
    .then(user => {
      console.log("google user info"+JSON.stringify(user));
      let accessTokenFromProvider = user.accessToken;
      console.log("accessTokenFromProvider.....: "+accessTokenFromProvider); 

      //**************************//
      let google_user = {
        "name": user.displayName,
			  "email": user.email,
			  "picture": user.imageUrl
      }

      this.storage.set("socialType",3);
      // this.storage.set("google_user",google_user)
      this.storage.set("user_info",google_user)
      .then(() => {
        this.event.publish("login");
        this.navCtrl.setRoot(TabsPage);
      });
      console.log(google_user);
      this.storage.set("Makadyusername", "true");

      //api to save in db and return access_token
      this.provider.userLoginWithSocial(user.id,3,user.name,user.email,this.lang,user.imageUrl,0,"0000-00-00",data => {
      
        data = JSON.parse(data);
        console.log(data);

        this.storage.set("makadyaccess",data.access_token); 
        //set token in localstorage
        localStorage.setItem('kdkvfkhggssomakady', data.access_token);
        //set refreshtoken in localstorage
        localStorage.setItem('reefdfdfvcvcmakady',data.refresh_token); 

        this.provider.getuser(data.access_token,data => {
          this.helper.user_id = data.user.id;

        },error => {
          console.log(error);
        });
      },
      error => {
        console.log(error);
      });

      //**************************//
      
      this.googlePlus.logout().then(() => {
        console.log("close ggole plus seesion success");
      }).catch(() => {
        console.log("close ggole plus seesion failed");
      })
    })
    .catch(err => console.error("err: ",err));
  }

  //login with twitter socila netwwork.
  doTwLogin() {
    if (navigator.onLine ) {

      //Request for login
      this.twitter.login()
      .then(result => {
          console.log("twitter login info " + JSON.stringify(result));
          this.twitter.showUser()
          .then(user => {
              console.log("twitter user info" + JSON.stringify(user));
              let secret = user.secret;
              let accessTokenFromProvider = user.token;

              //get user gender from twitter response.
              let user_gender = user.gender;
              if (typeof (user_gender) === "undefined" || user_gender === null) {
                user_gender = 0;
              }
              
              console.log("twitter data", user.id, " -", user.name, " -", user.profile_image_url_https);
              
              
              //*************************************//
              this.storage.set("socialType",2);
              let twitterUser = {
                "name": user.name,
                "picture": user.profile_image_url_https,
              }
              // this.storage.set("twitter_user",twitterUser)
              this.storage.set("user_info",twitterUser)
              .then(() => {
                this.event.publish("login");
                this.navCtrl.setRoot(TabsPage);
              });
              console.log(twitterUser);
              this.storage.set("Makadyusername", "true");
                
              // // this.loginservice.userLoginWithSocial(user.id, 2, user.name, user.profile_image_url_https, 0, "0000-00-00", (data) => this.socialLoginSuccessCallback(data), (data) => this.socialLoginFailureCallback(data))

              // // setTimeout(() => {
                this.provider.userLoginWithSocial(user.id,2,user.name,"",this.lang,user.profile_image_url_https,0,"0000-00-00",data => {
                  //return with access
                  data = JSON.parse(data);
                  console.log(data);
                  this.storage.set("makadyaccess",data.access_token); 
                  //set token in localstorage
                  localStorage.setItem('kdkvfkhggssomakady', data.access_token);
                  //set refreshtoken in localstorage
                  localStorage.setItem('reefdfdfvcvcmakady',data.refresh_token);

                  this.provider.getuser(data.access_token,data => {
                    this.helper.user_id = data.user.id;
    
                  },error => {
                    console.log(error);
                  });
                },
                error => {
                  console.log(error);
                });
              // // },500);
              //****************************************//

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

  togglePwd() {
    if(this.hidePassword) {
      this.hidePassword = false;
      this.pwdType = "text";
      this.iconName = "ios-eye";
    } else {
      this.hidePassword = true;
      this.pwdType = "password";
      this.iconName = "ios-eye-off";        
    }  
  }

  changelang() {
    this.helper.changelang();

    this.langdirection = this.helper.langdirection;
  }
}


 