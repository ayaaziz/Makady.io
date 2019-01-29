import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,NavController, ActionSheetController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../providers/helper/helper';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { SettingsPage } from '../pages/settings/settings';
import { FriendsPage } from '../pages/friends/friends';
import { MainproviderProvider } from '../providers/mainprovider/mainprovider';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ProductsPage } from '../pages/products/products';
import { AboutPage } from '../pages/about/about';
import { dateDataSortValue } from 'ionic-angular/util/datetime-util';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navctrl: Nav;
  @ViewChild("content") nav: NavController
  rootPage:any;
  userLang:any
  photo:any
  username;
  langdirection

  // {"username":"test","name":"test","email":"test@gmail.com","password":"1234","password_confirmation":"1234","phone":"1234567890","profile_pic":null,"profile_pic_ext":null,"social_type":4,"firebase_id":"4rtghju98jhjk","type":"1","lang":"2"}
  constructor(public actionSheetCtrl: ActionSheetController,public camera:Camera,public event: Events,public imagepicker:ImagePicker,public provider:MainproviderProvider,public storage:Storage,public menu: MenuController,public translate:TranslateService,public helper:HelperProvider,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.event.subscribe("login", ()=>{
        this.storage.get("user_info").then((val)=>{
          this.username = val.user.username
          this.photo = val.user.profile_pic 
          console.log("user_info : ",val)
        })
      })
      // this.helper.langdirection="rtl"
      // this.langdirection = "rtl"
      // if(this.helper.langdirection=="ltr")
      // {dateDataSortValue
      // this.userLang = 'en';
      // this.translate.setDefaultLang('en');
      // }else{
      //   this.userLang = 'ar';
      // this.translate.setDefaultLang('ar');
      // }
      // if (this.userLang == 'ar') {
      //   this.translate.setDefaultLang('ar');  
      //   this.translate.use('ar');    
      //   this.platform.setDir('rtl', true);
      //   this.helper.langdirection = "rtl";   
      //   this.langdirection = "rtl"
      // }else {
      //       this.translate.setDefaultLang('en');
      //       this.translate.use('en');
      //       this.platform.setDir('ltr', true);
      //       this.helper.langdirection = "ltr";
      //       this.langdirection = "ltr"
      //     }

      if(this.platform.is('ios'))
      {
        this.helper.type="2"
      }
      else
      {
        this.helper.type="1"
      }
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#696767");
      splashScreen.hide();
      this.initLang()
      this.storage.get("Makadyusername").then((val)=>{
        this.storage.get("user_info").then((val)=>{
          this.username = val.user.username
        })
           if(val=="true")
           {
           this.navctrl.setRoot(TabsPage)
           }
           else{
   
          this.navctrl.push(LoginPage)
   
           }
         })
    });
  }
  openhome()
  {
      this.navctrl.setRoot(TabsPage, { tabIndex: 0 });
    this.menu.close()

  }
  openlists()
  {
    this.navctrl.setRoot(TabsPage, { tabIndex: 1 });
    this.menu.close()
  }
  products()
  {
    this.navctrl.setRoot(TabsPage).then(()=>{
      this.navctrl.push(AboutPage)
    });

  }
  offers()
  {
    this.navctrl.setRoot(TabsPage, { tabIndex: 2 });

  }
  friends()
  {
 this.navctrl.setRoot(TabsPage).then(() => {
   this.navctrl.push(FriendsPage)
 })
  }
  groups()
  {
    this.navctrl.setRoot(TabsPage, { tabIndex: 3 });

  }
  settings()
  {
     this.navctrl.setRoot(TabsPage).then(() => {
this.navctrl.push(SettingsPage)
     })
  }
  logout()
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.logout(1,val,(data)=>{
          this.navctrl.push(LoginPage)
          this.storage.remove("Makadyusername")
          this.storage.remove("Mlanguage")
          console.log(JSON.stringify(data))
        },(data)=>{})
      }
    })
    
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
  choose()
  {
    let options= {
      maximumImagesCount: 1,
    }
    this.imagepicker.getPictures(options)
    .then((results) => {
      this.photo=results
     
    }, (err) => { console.log(err) });
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

  initLang(){
    this.storage.get('Mlanguage').then((val) => {
      if(val){
        console.log("lang value detected",val);
        if(val == 'ar'){
          this.translate.setDefaultLang('ar');  
          this.translate.use('ar');    
          this.platform.setDir('rtl', true);
          this.helper.langdirection = "rtl";   
          //this.menuSide = "right";

        }else{
          console.log("form initializeLang: ",val);
          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.platform.setDir('ltr', true);
          this.helper.langdirection = "ltr";
         // this.menuSide = "left";
        }
      }else{
        console.log("lang value not detected",val);
        var userLang = navigator.language.split('-')[0];
        console.log("navigator.language",navigator.language);
        console.log("userlang",userLang);
        
      //  userLang = 'ar';
    
        if (userLang == 'ar') {
          this.translate.setDefaultLang('ar');  
          this.translate.use('ar');    
          this.platform.setDir('rtl', true);
          this.helper.langdirection = "rtl";   
         // this.menuSide = "right";
        }else {
              this.translate.setDefaultLang('en');
              this.translate.use('en');
              this.platform.setDir('ltr', true);
              this.helper.langdirection = "ltr";
             // this.menuSide = "left";
        }

      }
    });


  }
}
