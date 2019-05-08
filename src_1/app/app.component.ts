import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,NavController, ActionSheetController } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navctrl: Nav;
  @ViewChild("content") nav: NavController
  rootPage:any;
  userLang:any
  photo:any
  constructor(public actionSheetCtrl: ActionSheetController,public camera:Camera,public imagepicker:ImagePicker,public provider:MainproviderProvider,public storage:Storage,public menu: MenuController,public translate:TranslateService,public helper:HelperProvider,public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.helper.langdirection="rtl"
      if(this.helper.langdirection=="ltr")
      {
      this.userLang = 'en';
      this.translate.setDefaultLang('en');
      }else{
        this.userLang = 'ar';
      this.translate.setDefaultLang('ar');
      }
      if (this.userLang == 'ar') {
        this.translate.setDefaultLang('ar');  
        this.translate.use('ar');    
        this.platform.setDir('rtl', true);
        this.helper.langdirection = "rtl";   
      }else {
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            this.platform.setDir('ltr', true);
            this.helper.langdirection = "ltr";
          }
   this.storage.get("Makadyusername").then((val)=>{
        if(val=="true")
        {
        this.navctrl.setRoot(TabsPage)
        }
        else{

       this.navctrl.push(LoginPage)

        }
      })
      if(this.platform.is('ios'))
      {
        this.helper.type="2"
      }
      else
      {
        this.helper.type="1"
      }
      statusBar.styleDefault();
      splashScreen.hide();
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
            this.take()
          }
        },
        {
          text: this.translate.instant('choose'),
          handler: () => {
           this.choose()
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
  take()
  {
     const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     console.log(JSON.stringify(imageData))
     let base64Image = 'data:image/jpeg;base64,' + imageData;  
     this.photo=base64Image
        console.log(JSON.stringify(base64Image))
    }, (err) => {
      console.log(JSON.stringify(err))
    });
  }
}
