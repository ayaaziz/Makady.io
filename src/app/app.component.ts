import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,NavController, ActionSheetController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { HelperProvider } from '../providers/helper/helper';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { SettingsPage } from '../pages/settings/settings';
import { MainproviderProvider } from '../providers/mainprovider/mainprovider';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { CategoriesPage } from '../pages/categories/categories';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { SettingsProvider } from '../providers/settings/settings';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navctrl: Nav;
  @ViewChild("content") nav: NavController;
  rootPage:any;
  userLang:any;
  photo:any;
  username;
  langdirection;
  side:string;
  userLoged: boolean = false;
  prodNotification: boolean = false;
  offersNotification: boolean = false;

  constructor(public actionSheetCtrl: ActionSheetController,
              public camera:Camera,
              public event: Events,
              public imagepicker:ImagePicker,
              public provider:MainproviderProvider,
              public storage:Storage,
              public menu: MenuController,
              public translate:TranslateService,
              public helper:HelperProvider,
              public platform: Platform, 
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private push: Push,
              private settingsService:SettingsProvider
              // private pushObject: PushObject
            ) {

    platform.ready().then(() => {
      this.event.subscribe("login", () => {
        this.storage.get("user_info").then(val => {
          console.log("user_info : ",JSON.stringify(val));
           
          if(val) {
            this.userLoged = true;
            this.username = val.user.username;
            this.photo = this.helper.userImagePath + val.user.profile_pic;
            console.log(this.photo);
          }
        });
      });
    

      if(this.platform.is('ios')) {
        this.helper.type="2"
      } else {
        this.helper.type="1"
      }
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#f2622c");
      splashScreen.hide();
      this.initLang();

      //push notification setup
      this.pushSetup();
    

      //this is to determine the text direction depending on the selected language
      this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
      { 
        if(event.lang == 'ar') {
            platform.setDir('rtl', true);
            platform.setDir('ltr', false);
            // this.side = "right";   
          } else {
            platform.setDir('ltr', true);
            platform.setDir('rtl', false);
            // this.side = "left";          
          }     
      });

      this.storage.get("Makadyusername").then((val)=> {
        if(!val) {
          this.navctrl.push(LoginPage);
          return;
        }
        this.storage.get("user_info").then((userInfo)=> {
          if(!userInfo) {
            this.navctrl.push(LoginPage);
            return;
          }
          this.username = userInfo.user.username;
        })
           if(val=="true") {
             this.event.publish("login");
             this.navctrl.setRoot(TabsPage);
           } else {
              this.navctrl.push(LoginPage);
           }
      });


      //************************** Product Settings ************************//
      this.settingsService.getNotificationStatus()
      .then(data => {  
        if(data === null ) data = true; 
        this.prodNotification = data;    
                 
          console.log("product notification..:"+JSON.stringify(this.prodNotification));     
          this.settingsService.sendNotificstionStatus(this.prodNotification);
      });      

       //************************** Offers Settings ************************//
       this.settingsService.getOffersNotificationStatus()
       .then(data => {
          if(data === null) data = true;
        this.offersNotification = data;    
          
          console.log("offers notification..:"+JSON.stringify(this.offersNotification));                   
          this.settingsService.sendOffersNotificstionStatus(this.offersNotification);   
          
          // //open or close Offers notification
          // if(data) {
          //   // pushObject.subscribe("Offers")
          //   .then(data => {
          //     console.log(data);
          //   });
          // } else {
          //   // pushObject.unsubscribe("Offers")
          //   .then(data => {
          //     console.log(data);
          //   });
          // }
          
       });
    });
  }

  //************************ Push Notification ****************************//
  pushSetup() {

    // to initialize push notifications
    const options: PushOptions = {
      android: {
        forceShow: true
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
    }

    const pushObject:PushObject = this.push.init(options);

    // open or close product notification
    // if(this.prodNotification) {
    //   pushObject.subscribe("Product")
    //   .then(data => {
    //     console.log(data);
    //   });           
    // } else {
    //   pushObject.unsubscribe("Product")
    //   .then(data => {
    //     console.log(data);
    //   });
    // }

    // //open or close offers notification
    // if(this.offersNotification) {
    //   pushObject.subscribe("Offers")
    //   .then(data => {
    //     console.log(data);
    //   });           
    // } else {
    //   pushObject.unsubscribe("Offers")
    //   .then(data => {
    //     console.log(data);
    //   });
    // }


    pushObject.on('notification').subscribe((notification: any) => {

      //handle notification
      console.log('Received a notification', notification);
      alert(JSON.stringify(notification));
      
    }); 

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
    });
    
    }

  openhome() {
      this.navctrl.setRoot(TabsPage, { tabIndex: 2 });
      this.menu.close();
  }

  openlists() {
    this.navctrl.setRoot(TabsPage, { tabIndex: 0 });
    this.menu.close();
  }

  products() {
    this.navctrl.setRoot(TabsPage).then(()=> {
      this.navctrl.push(CategoriesPage);
    });
  }

  offers() {
    this.navctrl.setRoot(TabsPage, { tabIndex: 1 });
  }

  friends() {
    this.navctrl.setRoot(TabsPage, { tabIndex: 4 });
  }

  groups() {
    this.navctrl.setRoot(TabsPage).then(() => {
      this.navctrl.push(GroupsPage);
    });
  }

  settings() {
      this.navctrl.setRoot(TabsPage).then(() => {
        this.navctrl.push(SettingsPage);
     });
  }

  logout() {
    this.storage.get("makadyaccess").then((val)=> {
      if(val) {
        this.provider.logout(1,val,(data) => {
          this.userLoged = false;
          this.storage.remove("Makadyusername");
          this.storage.remove("Mlanguage");

          this.storage.remove("Makadyuser_name");
          this.storage.remove("makadyaccess");
          this.storage.remove("user_info");
          this.navctrl.push(LoginPage);
        
          console.log(JSON.stringify(data))
        },(data)=>{})
      }
    });
  }
  
  getimg() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translate.instant('takepic'),
          handler: () => {
            this.take(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.instant('choose'),
          handler: () => {
            this.take(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.instant('cancel'),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present(); 
  }

  // choose() {
  //   let options = {
  //     maximumImagesCount: 1,
  //   }
  //   this.imagepicker.getPictures(options)
  //   .then((results) => {
  //     this.photo=results
     
  //   }, (err) => { console.log(err) });
  // }

  take(sourceType) {
  
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
    
      this.photo = 'data:image/jpeg;base64,' + imageData;  
    //  let imgdata = encodeURIComponent(imageData);
      // this.photo = base64Image;

       

          //update image in db
          this.storage.get("makadyaccess").then(access => {
            if(access) {
              this.provider.changeProfilePicture(access,imageData,'jpeg',data => {
                if(data) {

                  //update image in storage
                  this.storage.get('user_info').then((val) => {
                    if (val) { 
                      val.user.profile_pic = data.user.profile_pic;
                      this.storage.set("user_info", val);
                    }});

                  this.helper.presentToast(this.translate.instant("picchanged"));
                }
              },
              error => {
                
              });
            }
          });
        
        

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

        } else {
          console.log("form initializeLang: ",val);
          this.translate.setDefaultLang('en');
          this.translate.use('en');
          this.platform.setDir('ltr', true);
          this.helper.langdirection = "ltr";
        }
      } else{
        console.log("lang value not detected",val);
        var userLang = navigator.language.split('-')[0];
        console.log("navigator.language",navigator.language);
        console.log("userlang",userLang);
    
        if (userLang == 'ar') {
          this.translate.setDefaultLang('ar');  
          this.translate.use('ar');    
          this.platform.setDir('rtl', true);
          this.helper.langdirection = "rtl";   

        } else {
            this.translate.setDefaultLang('en');
            this.translate.use('en');
            this.platform.setDir('ltr', true);
            this.helper.langdirection = "ltr";
        }
      }
    });
  }

}
