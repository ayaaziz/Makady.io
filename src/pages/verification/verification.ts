import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';


@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage {
  @ViewChild('focusInput1') myInput1 ;
  @ViewChild('focusInput2') myInput2 ;
  @ViewChild('focusInput3') myInput3 ;
  langdirection:any
  password:any
  input1:any
  input2:any
  input3:any
  input4:any
  ver:string
  emailcode:any
  username:any
  hide:any=false
  show:any=true
  constructor(public provider:MainproviderProvider,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
  this.username=this.navParams.get("username")
  this.emailcode=this.navParams.get("emailcode")
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    console.log(this.langdirection)
    console.log('ionViewDidLoad VerificationPage');
  }
onInputTime(ev)
{
    setTimeout(() => {
      this.myInput1.setFocus();
    },500); 
      }
      onInputTime1(ev)
      {
        setTimeout(() => {
          this.myInput2.setFocus();
        },500); 
          }
              onInputTime2(ev)
              {
                setTimeout(() => {
                  this.myInput3.setFocus();
                },500); 
                  }
                  onInputTime3()
                  { 
                setTimeout(() => {
                  this.hide=true
                  this.show=false
                  this.ver=this.input1+this.input2+this.input3+this.input4                    
                  },500);    
                         
                  }
  gohome()
  {
    console.log(this.emailcode)
    console.log(this.password)
    console.log(this.username)
    this.provider.updatepass(this.username,this.emailcode,this.password,(data)=>{
      console.log(JSON.stringify(data))
      this.navCtrl.setRoot(TabsPage)

    },(data)=>{

    })
  }
  resend()
  {
    this.provider.forgetpass(this.username,(data)=>{
      console.log(JSON.stringify(data))
      let dataparsed=JSON.parse(data)
      this.username=dataparsed.data.username
      this.emailcode=dataparsed.data.email_code
     
    },(data)=>{

    })
  }
}
