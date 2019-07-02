import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ViewController, Events, Platform } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  userForm:FormGroup;
  imgdata = null;
  userImageUrl = "";
  user:any;
  langdirection:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public provider:MainproviderProvider,
              public storage :Storage,
              private camera: Camera,
              public toastCtrl:ToastController,
              // public formBuilder:FormBuilder,
              public event: Events,
              public translate:TranslateService,
              public helper:HelperProvider, 
              public actionSheetCtrl: ActionSheetController,
              public ViewCtrl:ViewController,
              private platform:Platform) {

                this.langdirection = this.helper.langdirection;
                this.user = this.navParams.get("user");

                console.log("profile data......: "+JSON.stringify(this.user));
                this.userImageUrl =  this.helper.userImagePath + this.user.user.profile_pic;

                this.initializeForm();    
                
                
                let backAction =  platform.registerBackButtonAction(() => {
                  console.log("second");
                  this.navCtrl.pop();
                  backAction();
                },2)
              }


  private initializeForm() {

    this.userForm = new FormGroup({
      'username': new FormControl(this.user.user.username,Validators.compose([Validators.required,Validators.minLength(4)])),
      'name': new FormControl(this.user.user.name,Validators.required),
      'email': new FormControl(this.user.user.email,Validators.compose([Validators.required,Validators.email])),
      'phone': new FormControl(this.user.user.phone,Validators.compose([Validators.minLength(9),Validators.maxLength(12)]))
    });

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
        //to display
        this.userImageUrl = 'data:image/jpeg;base64,' + imageData;
        //this.storage.set("user_image",this.userImageUrl)

        //to save in db 
        this.imgdata = imageData;          
        // this.imgdata = encodeURIComponent(imageData);  
       
        console.log("imge when take pic :"+this.imgdata);
      })
    });
  }

  onSubmit() {
    const val = this.userForm.value;
    // val = JSON.parse(val);
    console.log("val: "+JSON.stringify("form data.....: "+JSON.stringify(val)));
   
       this.provider.editProfile(val,this.imgdata,"jpeg",data => {
        console.log("data: "+JSON.stringify(data));
        data = JSON.parse(data);

        if(data.errors) {
          if(data.errors.email) {
            this.helper.presentToast(this.translate.instant("emailExist"));
          } 
        }
      
        if(data.success) {
          console.log("data.profile_pic: "+data.user.profile_pic);
          this.event.publish("usernameChanged",data.user.username);          
          this.event.publish("picChanged",data.user.profile_pic);
          this.helper.presentToast(this.translate.instant('profileEdited'));
        }

       },error => {
         console.log(error);
       });
      
  }

  

}
