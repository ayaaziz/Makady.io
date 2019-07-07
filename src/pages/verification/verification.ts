import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage {
  @ViewChild('focusInput') myInput;
  @ViewChild('focusInput1') myInput1;
  @ViewChild('focusInput2') myInput2;
  @ViewChild('focusInput3') myInput3;
  langdirection: any;
  password:any;
  input1: any = " ";
  input2: any = " ";
  input3: any = " ";
  input4: any = " ";
  inputOne = false;
  inputTwo; 
  inputThree;
  inputFour;
  ver: string;
  emailcode: any;
  username: any;
  hide: any = false;
  show: any = true;
  userId:number;
  email:string;
  access:string;
  pageType:string;
  isRegister:boolean;
  remember:boolean = false;
  confirmPassword:any;
  invalidLength:boolean = false;
  dontmatch:string = "";
  isEmpty2:boolean = false;
  isEmpty3:boolean = false;


  constructor(public provider: MainproviderProvider,
              public helper: HelperProvider, 
              public translate: TranslateService, 
              public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCtrl:LoadingController,
              private event:Events,
              private storage:Storage,
              private platform:Platform) {

              this.username = this.navParams.get("username");
              this.emailcode = this.navParams.get("emailcode");
              this.userId = this.navParams.get("userId");
              // this.email = this.navParams.get("email");
              // this.access = this.navParams.get("access");   
              this.pageType = this.navParams.get("pageType");
              this.isRegister = this.navParams.get("register");
              this.remember = this.navParams.get("isRemembered");

  }

  ionViewWillEnter() {
    this.langdirection = this.helper.langdirection;

    this.helper.presentToast(this.translate.instant("entercodesent")); 
 
    setTimeout(() => {
      this.input1 = " ";
      this.input2 = " ";
      this.input3 = " ";
      this.input4 = " ";

      this.inputOne = false;
      this.inputTwo = true;
      this.inputThree = true;
      this.inputFour = true;
      this.myInput.setFocus();
    },500);
  }

  onInputTime(ev) {
    console.log("ev ",ev.inputType);
    let val = String(this.input1).trim();
    if(ev.inputType == "deleteContentBackward") {
      this.input1 = " ";
    } else if(val) {
      this.inputOne = true;
      this.inputTwo = false;
      this.inputThree = true;
      this.inputFour = true;
      this.input2 = " "
      this.myInput1.setFocus();
    }
    else {
      this.input1 = " ";
    }
  }
  
  onInputTime1(ev) {
    console.log("ev ",ev.inputType);
    let val = String(this.input2).trim();

    if(ev.inputType == "deleteContentBackward" && this.input2) {
      this.input2 = " ";

    } else if(ev.inputType == "deleteContentBackward" && !this.input2) {
      this.input2 = " ";
      this.input1 = " ";
      this.inputOne = false;
      this.inputTwo = true;
      this.inputThree = true;
      this.inputFour = true;
      this.myInput.setFocus();
    
    } else if(val) {
        this.inputOne = true;
        this.inputTwo = true;
        this.inputThree = false;
        this.inputFour = true;
        this.input3 =" ";
        this.myInput2.setFocus();
    
      } else {
          this.input2 = " ";
    }
  }

  onInputTime2(ev) {
    console.log("ev ",ev.inputType);
    let val = String(this.input3).trim();

    if(ev.inputType == "deleteContentBackward" && this.input3) {
      this.input3 = " ";
    
    } else if(ev.inputType == "deleteContentBackward" && !this.input3) {
      this.input3 = " ";
      this.input2 = " ";
      this.inputOne = true;
      this.inputTwo = false;
      this.inputThree = true;
      this.inputFour = true;
      this.myInput1.setFocus();
    
    } else if(val) {
        this.inputOne = true;
        this.inputTwo = true;
        this.inputThree = true;
        this.inputFour = false;
        this.input4 = " ";
        this.myInput3.setFocus();
    
      } else {
          this.input3 = " ";
    }
  }

  onInputTime3(ev) {

    if(ev.inputType) {
      console.log("ev ",ev.inputType);
      let val = String(this.input4).trim();
  
      //this.input4 ? alert(1) : alert(0)
      if(ev.inputType == "deleteContentBackward" && this.input4) {
        this.input4 = " ";
      
      } else if(ev.inputType == "deleteContentBackward" && !this.input4) {
        this.input4 = " ";
        this.input3 = " ";
        this.inputOne = true;
        this.inputTwo = true;
        this.inputThree = false;
        this.inputFour = true;
        this.myInput2.setFocus();
      
      } else if(val) {
        this.ver = this.input1.trim() + this.input2.trim() + this.input3.trim() + this.input4.trim();
        console.log("user ver"+this.ver);
        console.log("email code"+this.emailcode);
        const spinner = this.loadingCtrl.create();
        spinner.present();
  
        
        //check matching between user verification code and the code sent to email
        let result = this.helper.verifyAccount(this.ver,this.emailcode);
          spinner.dismiss();
          if(result) { //matched
      
            if(this.pageType === "AuthPage") {  //from login or signup page
              //make this user verified 
              this.storage.get("makadyaccess").then((val)=>{
                if(val)
                { 
                  this.provider.setVerified(val, data => {
                    data = JSON.parse(data);
                    if(data.success) {
                  
                      if (this.remember) {
                        this.storage.set("Makadyusername", "true");
                      }
  
                      this.storage.get("user_info")
                      .then(val => {
                        val.user.verified = 1;
                        this.storage.set("user_info",val)
                        .then(() => {
                          this.event.publish("login");
                          this.navCtrl.setRoot(TabsPage);
                        }); 
                      });
  
                    }
                  },error => {
                    console.log(error);
                  });
                }
              });
            
            } else { //from forgetpassword page
              
              //show new password page
              this.show = false;
              this.hide = true;
            }
  
          } else { //not matched
              this.helper.presentToast(this.translate.instant("notMatchedCode"));
             
              this.input1 = this.input2 = this.input3 = this.input4 = "";
                
              setTimeout(() => {
                this.inputOne = false;
                this.inputTwo = true;
                this.inputThree = true;
                this.inputFour = true;
                this.myInput.setFocus();
              },500);
          }
  
      } else {
        this.input3 = " ";
      }
    }
  }


  //update password and return home
  gohome() {
    console.log(this.emailcode);
    console.log(this.password);
    console.log(this.username);
    this.provider.updatepass(this.username, this.emailcode, this.password,data => {
      console.log(JSON.stringify(data));
      data = JSON.parse(data);

      if(data.success) {
        this.helper.presentToast(this.translate.instant("newPasswordSuccess"));
        this.navCtrl.setRoot(LoginPage);
      } 
      // this.navCtrl.setRoot(TabsPage);

    },error => {
      console.log(error);
    });
  }

  resend() {
  
    let type:string = "";
    if(this.pageType === "AuthPage") 
      type = "verification";
    else 
      type = "forgetPassword";

    this.provider.forgetpass(this.username,type, (data) => {
      console.log(JSON.stringify(data))
      let dataparsed = JSON.parse(data)
      this.username = dataparsed.data.username
      this.emailcode = dataparsed.data.email_code

      if(data) {
        this.helper.presentToast(this.translate.instant("codesent"));
        // this.event.publish("reload");
        setTimeout(() => {
          this.inputOne = false;
          this.inputTwo = true;
          this.inputThree = true;
          this.inputFour = true;
          this.myInput.setFocus();
        },500);
        this.input1 = this.input2 = this.input3 = this.input4 = "";
      }

    }, (data) => {

    })
  }

  // resendCode() {
  //   //cal api to send verification code to the user email and return with code          
  //   //***************** test *******************//
  //   let sentCode = this.provider.sendVerCode(this.email);
  //   if(sentCode) {
  //     this.helper.presentToast("تم إرسال كود التفعيل إلى بريدك الإلكتروني");
  //     // this.event.publish("reload");
  //     setTimeout(() => {
  //       this.inputOne = false;
  //       this.inputTwo = true;
  //       this.inputThree = true;
  //       this.inputFour = true;
  //       this.myInput.setFocus();
  //     },500);
  //     this.input1 = this.input2 = this.input3 = this.input4 = "";
  //   } 
  // }

  onChange2() {
    this.invalidLength = false;
    this.isEmpty2 = false;
    this.dontmatch = "";

    if(!this.password) {
      this.isEmpty2 = true;

    } else if(this.password.length < 4) {
      this.invalidLength = true;
    } 
    
    if(this.confirmPassword && this.confirmPassword !== this.password) 
      this.dontmatch = this.translate.instant('dontmatch');
  }

  onChange3() {
    this.dontmatch = "";
    this.isEmpty3 = false;

    if(!this.confirmPassword) {
      this.isEmpty3 = true;
    
    } else if(this.confirmPassword !== this.password) {
      this.dontmatch = this.translate.instant('dontmatch');
    }  
  }

  onBlur2() {
    this.isEmpty2 = false;

    if(!this.password) 
      this.isEmpty2 = true;
  }

  onBlur3() {
    this.isEmpty3 = false;

    if(!this.confirmPassword) 
      this.isEmpty3 = true;
  }
}
