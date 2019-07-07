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
  langdirection:any;
  current:any="";
  confirm:any="";
  new:any="";
  incorrectOldPwd:string = "";
  invalidLength:boolean = false;
  dontmatch:string = "";
  isEmpty1:boolean = false;
  isEmpty2:boolean = false;
  isEmpty3:boolean = false;

  constructor(public ViewCtrl:ViewController,public toastCtrl:ToastController,public translate:TranslateService,public storage:Storage,public platform:Platform,public provider:MainproviderProvider,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.langdirection=this.helper.langdirection;   
    
  }

  change()
  {
    this.incorrectOldPwd = "";

    // if(this.confirm=="" || this.current=="" || this.new=="" )
    // {
    //   this.isEmpty = true;
    //   return;
    // }
    // else if(!(this.new==this.confirm))
    // {
    //   this.presentToast(this.translate.instant('dontmatch'))

    // }
    // else{
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.checkpass(this.current,val,(data)=>{
          console.log(JSON.stringify(data));
          let dataparsed=JSON.parse(data);

          if(!dataparsed.success) {
              // this.incorrectOldPwd  = this.translate.instant("incorrectOld");
              this.helper.presentToast(this.translate.instant("incorrectOld"));
          } else {
            this.provider.changepass(this.current,this.new,this.confirm,val,data => {
              console.log(JSON.stringify(data));
              data = JSON.parse(data);

              if(data.success) {
                this.current = "";
                this.new = "";
                this.confirm = "";
                this.helper.presentToast(this.translate.instant('changed'));
                this.navCtrl.pop();
              
              } else {
                if(data.error.password == "new password same old password") {
                  this.helper.presentToast(this.translate.instant("newSameOld"));
                }
              } 
             
            },error =>{
              console.log(error);
            });
          }
        },error => {
          console.log(error);
        });

      }
    })
  // }
  }

  onChange1() {
    this.isEmpty1 = false;

    if(!this.current) {
      this.isEmpty1 = true;

    } 
  }

  onChange2() {
    this.invalidLength = false;
    this.isEmpty2 = false;
    this.dontmatch = "";

    if(!this.new) {
      this.isEmpty2 = true;

    } else if(this.new.length < 4) {
      this.invalidLength = true;
    } 
    
    if(this.confirm && this.confirm !== this.new) 
      this.dontmatch = this.translate.instant('dontmatch');
  }

  onChange3() {
    this.dontmatch = "";
    this.isEmpty3 = false;

    if(!this.confirm) {
      this.isEmpty3 = true;
    
    } else if(this.confirm !== this.new) {
      this.dontmatch = this.translate.instant('dontmatch');
    }  
  }
  
  onBlur1() {
    this.isEmpty1 = false;
    if(!this.current) 
      this.isEmpty1 = true;
  }

  onBlur2() {
    this.isEmpty2 = false;

    if(!this.new) 
      this.isEmpty2 = true;
  }

  onBlur3() {
    this.isEmpty3 = false;

    if(!this.confirm) 
      this.isEmpty3 = true;
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
