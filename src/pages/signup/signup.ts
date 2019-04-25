import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, ToastController, Events, ActionSheetController } from 'ionic-angular';
import { HelperProvider } from '../../providers/helper/helper';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [Camera]
})
export class SignupPage {
  langdirection:any
  signupform : FormGroup;
  username: any=""
  Password: any=""
  phone: any=""
  name:any=""
  email:any=""
  confirmPassword:any=""
  lang:any
  imgdata = null;
  userImageUrl = ""
  constructor(public storage:Storage,public provider:MainproviderProvider,public event: Events,
    private camera: Camera,public toastCtrl:ToastController,public formBuilder:FormBuilder,
    public translate:TranslateService,public helper:HelperProvider,public navCtrl: NavController, 
    public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
   if(this.helper.langdirection=="ltr")
   {
     this.lang="1"
   }
   else{
    this.lang="2"
   }
  
  }

  selectImage() {

    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.instant("SelectImageSource"),
      buttons: [
        {
          text: this.translate.instant("LoadfromLibrary"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant("UseCamera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant("canceltxt"),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();

  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData: string) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.storage.get("user_login_token").then((val) => {
        this.userImageUrl = 'data:image/jpeg;base64,' + imageData
        //this.storage.set("user_image",this.userImageUrl)
        this.imgdata = encodeURIComponent(imageData)
      })
    }, (err) => {
      // Handle error
    });
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    console.log('ionViewDidLoad SignupPage');
  }
  login()
  {
   
    this.navCtrl.push(LoginPage)
  }
  signup()
  {
    console.log("all data ",this.phone,this.username,this.Password,this.confirmPassword,this.email,this.name)
     if(!this.phone || !this.username || !this.Password || !this.confirmPassword || !this.email|| !this.name)
    {
      this.presentToast(this.translate.instant('alldata'))

    }
    else if(!(this.Password==this.confirmPassword))
    {
      this.presentToast(this.translate.instant('dontmatch'))

    }
    else if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(String(this.email).trim()) == true || /^[\u0621-\u064A\s\p{N}]+$/.test(String(this.email).trim()) == true))
    {
      this.presentToast(this.translate.instant('invalidemail'))

    }
    else if(this.phone.length < 9 || this.phone.length > 12)
    {
      this.presentToast(this.translate.instant('invalidphone'))

    }
  
  
    else
    {
      this.provider.signup(this.username,this.name,this.email,this.Password,this.confirmPassword,this.phone,this.imgdata,null,4,"4rtghju98jhjk","1",this.lang,(data)=>{
       let parsedData=JSON.parse(data)
       console.log(parsedData)
       if(parsedData.success==false)
       {
         if(parsedData.errors.username){
           this.presentToast(this.translate.instant("username"))
         }
         else if(parsedData.errors.email_exist)
         {
           this.presentToast(this.translate.instant("emailExist"))
         }
       }
       else{
         this.provider.getuser(parsedData.access_token, (data)=>{
           data = JSON.parse(data)
          this.helper.accesstoken=parsedData.access_token
          this.storage.set("makadyaccess",parsedData.access_token)
          this.storage.set("user_info",data)
          this.event.publish("login")
          this.navCtrl.setRoot(TabsPage)
          
         },
         (data)=>{
           this.presentToast(this.translate.instant('serverErr'))
           this.navCtrl.setRoot(LoginPage)
         })
        

       }
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
