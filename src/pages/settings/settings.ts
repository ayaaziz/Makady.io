import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController ,ActionSheetController, Toggle} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { ChangepasswordPage } from '../changepassword/changepassword';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { TabsPage } from '../tabs/tabs';
import { SettingsProvider } from '../../providers/settings/settings';
import { HomePage } from '../home/home';
import { EditProfilePage } from '../edit-profile/edit-profile';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  langdirection:any
  scaleClass="";
  
  name:any;
  photo:any
  createdCode:any
  // recentProduct = true
  offers = true;
  productNotificationStatus: boolean = false;
  offersNotificationStatus: boolean = false;
  username:string;
  HomePage = HomePage;
  socialLinks:any = {};


  constructor(public actionSheetCtrl: ActionSheetController,
              public camera:Camera,
              public ViewCtrl:ViewController,
              public socialSharing:SocialSharing,
              public plt:Platform,
              public inap:InAppBrowser,
              public storage:Storage,
              public platform:Platform,
              public provider:MainproviderProvider,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private settingsService:SettingsProvider,
              // private pushObject: PushObject
            ) {


                this.langdirection=this.helper.langdirection;

                //Get Current Notificatiopns Status
                this.productNotificationStatus = this.helper.prodNotification;
                this.offersNotificationStatus = this.helper.offersNotification;
                
                if(this.langdirection == "rtl")
                  this.scaleClass="scaleClass";

  }
 
  getimg()
  {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translate.instant('takepic'),
          handler: () => {
            // this.take()
            this.take(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: this.translate.instant('choose'),
          handler: () => {
          //  this.choose()
          this.take(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        },
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
 
    actionSheet.present();
   
    
  }


  take(sourceType)
  {
    console.log("take pic")
    //  const options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.FILE_URI,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }
    var options = {
      quality: 100, //50
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      // allowEdit:true,
      // targetWidth:200,
      // targetHeight:200
    };
    this.camera.getPicture(options).then((imageData: string) => {
     console.log(JSON.stringify(imageData))
     let base64Image = 'data:image/jpeg;base64,' + imageData;  
     let imgdata = encodeURIComponent(imageData)
     this.photo=base64Image
        console.log( "base64Image: ",JSON.stringify(base64Image))
        // this.service.changeJSProfilePic(imgdata, 'jpeg'
        this.storage.get('user_info').then((val) => {
          console.log("val from get user_info", val);
          if (val) {
            var newuserData = val;
            newuserData.user.profile_pic = this.photo;
            // this.helper.storeJSInfo(newuserData);
            this.storage.set("user_info", newuserData)
          }});
    }, (err) => {
      console.log(JSON.stringify(err))
    });
  }

  loadData() {

    this.provider.getuser(data => {
      console.log(JSON.stringify(data));
      let Dataparsed=JSON.parse(data);
      if(Dataparsed.success) {
        this.createdCode = (Dataparsed.user.id).toString();
        this.username = Dataparsed.user.username;
        console.log(this.createdCode);
      } 
    },
    (error) => {
      console.log(error);
    });

    //get social links
    this.provider.getSocialLinks(data => {
      console.log("social data........"+data);
      data = JSON.parse(data);
      console.log("social data........"+JSON.stringify(data));
      
      this.socialLinks = data.data;
      console.log(" socialLinks........"+JSON.stringify(this.socialLinks));
      console.log(" facebook........"+JSON.stringify(this.socialLinks.facebook));
      
      

    },error => {
      console.log(error);
    });

    this.storage.get("Makadyuser_name").then((val) => {
      this.name = val;
    })

    console.log('ionViewDidLoad SettingsPage');
  }

  ionViewWillEnter() {
    this.loadData();
  }


  // changelang() {
  //   console.log(this.langdirection);
  //   //"this.lang" will come from dropdown
  //   this.translate.use(this.langdirection);

  //   //save selected language in local storage
  //   this.settingsService.setLang(this.langdirection);
  // }

  changelang()
  {
      if(this.helper.langdirection == "ltr")
      {
        this.translate.setDefaultLang('ar');  
        this.translate.use('ar');    
        this.platform.setDir('rtl', true);
        this.helper.langdirection = "rtl"; 
        this.scaleClass="scaleClass";
        this.storage.set('Mlanguage', 'ar').then(resp=>{
          console.log("resp set('language',: ",resp);
        });
        this.navCtrl.setRoot(TabsPage);
      
        this.provider.changelang(2,data=> {
          console.log("success");
        },error=> {
          console.log("error");
        });

      } else {
          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.platform.setDir('ltr', true);
          this.helper.langdirection = "ltr";
          this.storage.set('Mlanguage', 'en').then(resp=>{
            console.log("resp set('language',: ",resp)
          });
          this.navCtrl.setRoot(TabsPage);

          this.provider.changelang(1,data=> {
            console.log("success");
          },error=> {
            console.log("error");
          });
      }
  }

  changepass()
  {
    this.navCtrl.push(ChangepasswordPage)
  }
  opentwitter()
  {
    
  // this.inap.create('https://twitter.com/makady', '_system', 'location=yes');

  }
  openinsta()
  {
   
   //this.inap.create('https://www.instagram.com/makady/', '_system', 'location=yes');

  }
  openfacebook()
  {
   
  // this.inap.create('https://www.facebook.com/makady/', '_system', 'location=yes');

  }
  shareapp() {
    console.log("shareapp")
    // this.socialSharing.share("مقاضي" , "مقاضي" , null ,"https://play.google.com/store/apps/details?id=net.ITRoots.Makady").then(() => {
    //   console.log("success")
    // }).catch(() => {
    //   console.log("not available")
    // });


    var options = {
      message: this.translate.instant('makady'),
      subject: this.translate.instant('makadyDisc'),
      url: 'https://play.google.com/store/apps/details?id=net.ITRoots.Makady',
      chooserTitle: this.translate.instant('chooseapp'), // Android only, you can override the default share sheet title,
    };

    this.socialSharing.shareWithOptions(options).then(() => {
      console.log("success")
    }).catch(() => {
      console.log("not available")
    });
  } 
  
  open = false;
  toggleSection(){
  
    if(this.open) this.open=false;
    else this.open = true;
  }

  onToggleProductNotification(toggle:Toggle) {
    this.settingsService.changeProductNotificationToggle(toggle.checked);
    
    //open or close product notification

  }

  onToggleOffersNotification(toggle:Toggle) {
    this.settingsService.changeOffersNotificationToggle(toggle.checked);

    //open or close product notification
     
  }

  editProfile() {

    this.provider.getuser(data => {
      data = JSON.parse(data);
      console.log("prof data....: "+JSON.stringify(data));  

      this.navCtrl.push(EditProfilePage,{"user":data});
    },error => {
      console.log(error);
    });
  }

  doRefresh(event) {

    console.log("eventtt: "+event);

    console.log('Begin async operation');

    this.loadData();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    });
  }
}
