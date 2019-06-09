import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { BarcodeScanner  } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  langdirection:any;
  friends:any=[];
  groups:any=[];
  
  constructor(public alertCtrl:AlertController,
              public barcodeScanner:BarcodeScanner,
              public ViewCtrl:ViewController,
              public storage :Storage,
              public provider:MainproviderProvider,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public event:Events) {

    this.langdirection=this.helper.langdirection
 
  
  }


  ionViewWillEnter() {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.friends(val,data => {
          console.log(JSON.stringify(data))
          let parsedData=JSON.parse(data)
          this.friends=parsedData.friends
          console.log("friends: "+JSON.stringify(this.friends));
        
          parsedData.groups.forEach(group => {
            group.members = group.members.slice(0,4);
          });

          this.groups = parsedData.groups;

        },error => {
          console.log(error);
        });
      }
    });
  }

  delete(id)
  {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('confirmMsgfriend'),
      buttons: [
        {
          text: this.translate.instant('cancel'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.instant('ok'),
          handler: () => {
            this.storage.get("makadyaccess").then((val)=>{
              if(val)
              {
                this.provider.deletefriends(id,val,(data)=>{
                  console.log(JSON.stringify(data))
                  for(var i=0;i<this.friends.length;i++) {
                    if (this.friends[i].id == id) {
                      this.friends.splice(i, 1);
                    }
                  }
                },(data)=>{})
              }
            })
          }
        }
      ]
    });
    alert.present();

  }

  addfriend()
  {
    // Optionally request the permission early
//     QRScanner.prepare()
// .then((status) => {
//    if (status.authorized) {
//      // camera permission was granted


//      // start scanning
//      let scanSub = QRScanner.scan().subscribe((text: string) => {
//        console.log('Scanned something', text);
//        let user_id = text;
//       this.storage.get("makadyaccess").then((val)=>{
//         if(val)
//         {
//       this.provider.addfriends(user_id,val,(data)=>{
//         data = JSON.parse(data)
//         if(data.success){
//           this.helper.presentToast("تم إرسال طلب الصداقة بنجاح")
//         }
//         else{
//           this.helper.presentToast(data.errors)
//         }
//      console.log(JSON.stringify(data))
//       },(data)=>{
//         this.helper.presentToast(this.translate.instant('serverErr'))
//       })
//     }
//   })
//        QRScanner.hide(); // hide camera preview
//        scanSub.unsubscribe(); // stop scanning
//      });

//    } else if (status.denied) {
//      // camera permission was permanently denied
//      // you must use QRScanner.openSettings() method to guide the user to the settings page
//      // then they can grant the permission from there
//    } else {
//      // permission was denied, but not permanently. You can ask for permission again at a later time.
//    }
// })
// .catch((e: any) => console.log('Error is', e));
    this.barcodeScanner.scan().then(barcodeData => {

      let user_id = barcodeData.text;
      console.log("scan friend id: "+user_id);

      this.storage.get("makadyaccess").then((val)=>{
        if(val) {
          this.provider.addfriends(user_id,val,(data)=> {
            data = JSON.parse(data)
            if(data.success) {
              this.helper.presentToast(this.translate.instant("friendrequestsent"));
            }
            else {       
              this.helper.presentToast(data.errors);
            }
            console.log(JSON.stringify(data));

          },error => {
            console.log(error);
            console.log(this.translate.instant('serverErr'));
          });
    }
  })
    }, (err) => {
        console.log('Error: ', err);
    });
  }


  onInput(text:string) {

   
      this.storage.get("makadyaccess").then(val => {
        if(val) {

          if(text) {
            this.provider.searchFriends(val,text,data => {
              // console.log("search friend: "+JSON.stringify(data));
              if(data) {
                data = JSON.parse(data);
                console.log("search friend: "+JSON.stringify(data));
                this.friends = data.data;
              }
    
            },error => {
              console.log(error);
            })
          } else {
            this.provider.friends(val,data => {
              console.log(JSON.stringify(data))
              let parsedData=JSON.parse(data)
              this.friends=parsedData.friends
              console.log("friends: "+JSON.stringify(this.friends));
            
              parsedData.groups.forEach(group => {
                group.members = group.members.slice(0,4);
              });
    
              this.groups = parsedData.groups;
    
            },error => {
              console.log(error);
            });
          }

        }
      })
  
 
  }
  
}
