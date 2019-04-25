import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { TabsPage } from '../tabs/tabs';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { throttleTime } from 'rxjs/operators';


@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})
export class VerificationPage {
  @ViewChild('focusInput') myInput;
  @ViewChild('focusInput1') myInput1;
  @ViewChild('focusInput2') myInput2;
  @ViewChild('focusInput3') myInput3;
  langdirection: any
  password: any
  input1: any = " "
  input2: any = " "
  input3: any = " "
  input4: any = " "
  inputOne = false
  inputTwo 
  inputThree
  inputFour
  ver: string
  emailcode: any
  username: any
  hide: any = false
  show: any = true
  constructor(public provider: MainproviderProvider, public helper: HelperProvider, public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.username = this.navParams.get("username")
    this.emailcode = this.navParams.get("emailcode")
  }

  ionViewDidLoad() {
    this.langdirection = this.helper.langdirection
    setTimeout(() => {
      this.inputOne = false
      this.inputTwo = true
      this.inputThree = true
      this.inputFour = true
      this.myInput.setFocus()
    },500)
    console.log(this.langdirection)
    console.log('ionViewDidLoad VerificationPage');
  }
  onInputTime(ev) {
    console.log("ev ",ev.inputType)
    let val = String(this.input1).trim()
    if(ev.inputType == "deleteContentBackward")
    {
      this.input1 = " "
    }
    else if(val){
      this.inputOne = true
      this.inputTwo = false
      this.inputThree = true
      this.inputFour = true
      this.input2 = " "
      this.myInput1.setFocus();
    }
    else{
      this.input1 = " "
    }
  } 
  onInputTime1(ev) {
    console.log("ev ",ev.inputType)
    let val = String(this.input2).trim()
    if(ev.inputType == "deleteContentBackward" && this.input2)
    {
      this.input2 = " "
    }
    else if(ev.inputType == "deleteContentBackward" && !this.input2)
    {
      this.input2 = " "
      this.input1 = " "
      this.inputOne = false
      this.inputTwo = true
      this.inputThree = true
      this.inputFour = true
      this.myInput.setFocus()
    }
    else if(val){
        this.inputOne = true
        this.inputTwo = true
        this.inputThree = false
        this.inputFour = true
        this.input3 =" "
      this.myInput2.setFocus();
    }
    else{
      this.input2 = " "
    }
  }
  onInputTime2(ev) {
    console.log("ev ",ev.inputType)
    let val = String(this.input3).trim()
    if(ev.inputType == "deleteContentBackward" && this.input3)
    {
      this.input3 = " "
    }
    else if(ev.inputType == "deleteContentBackward" && !this.input3)
    {
      this.input3 = " "
      this.input2 = " "
      this.inputOne = true
      this.inputTwo = false
      this.inputThree = true
      this.inputFour = true
      this.myInput1.setFocus()
      
    }
    else if(val){
        this.inputOne = true
        this.inputTwo = true
        this.inputThree = true
        this.inputFour = false
        this.input4 = " "
      this.myInput3.setFocus();
    }
    else{
      this.input3 = " "
    }
    
  }
  onInputTime3(ev) {
    console.log("ev ",ev.inputType)
    let val = String(this.input4).trim()
    //this.input4 ? alert(1) : alert(0)
    if(ev.inputType == "deleteContentBackward" && this.input4)
    {
      this.input4 = " "
    }
    else if(ev.inputType == "deleteContentBackward" && !this.input4)
    {
      this.input4 = " "
      this.input3 = " "
      this.inputOne = true
      this.inputTwo = true
      this.inputThree = false
      this.inputFour = true
      this.myInput2.setFocus()
    }
    else if(val){
      //setTimeout(() => {
        //this.hide=true
        //this.show=false
        this.ver = this.input1.trim() + this.input2.trim() + this.input3.trim() + this.input4.trim()
     // }, 500);
    }
    else{
      this.input3 = " "
    }
    

  }
  gohome() {
    console.log(this.emailcode)
    console.log(this.password)
    console.log(this.username)
    this.provider.updatepass(this.username, this.emailcode, this.password, (data) => {
      console.log(JSON.stringify(data))
      this.navCtrl.setRoot(TabsPage)

    }, (data) => {

    })
  }
  resend() {
    this.provider.forgetpass(this.username, (data) => {
      console.log(JSON.stringify(data))
      let dataparsed = JSON.parse(data)
      this.username = dataparsed.data.username
      this.emailcode = dataparsed.data.email_code

    }, (data) => {

    })
  }
}
