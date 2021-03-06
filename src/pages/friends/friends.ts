import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { BarcodeScanner  } from '@ionic-native/barcode-scanner';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ZBar, ZBarOptions } from '@ionic-native/zbar';

@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  langdirection:any;
  friends:any=[];
  groups:any=[];
  allFriends:any = [];

  searchControl: FormControl;
  searching: any = false;

  
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
              public event:Events,
              // private qrScanner: QRScanner,
              private zbar: ZBar) {

    this.langdirection=this.helper.langdirection;

    this.searchControl = new FormControl();
 
  
  }

  loadData() {

    this.provider.friends(data => {
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.friends=parsedData.friends;
      console.log("friends: "+JSON.stringify(this.friends));

      this.allFriends = this.friends;
    
      parsedData.groups.forEach(group => {
        group.members = group.members.slice(0,4);
      });

      this.groups = parsedData.groups;

    },error => {
      console.log(error);
    });
  }


  ionViewWillEnter() {
    this.loadData();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.onInput(search);
    });
  }

  onSearchInput() {
    this.searching = true;
  }

  delete(id)
  {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('confirmMsgfriend'),
      buttons: [
        {
          text: this.translate.instant('yes'),
          handler: () => {
            this.provider.deletefriends(id,data => {
              console.log(JSON.stringify(data))
              for(var i=0;i<this.friends.length;i++) {
                if (this.friends[i].id == id) {
                  this.friends.splice(i, 1);
                }
              }
            },error => {
              console.log(error);
            })
          }
        },
        {
          text: this.translate.instant('no'),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
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


    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false
    }

    // this.barcodeScanner.scan().then(barcodeData => {
      this.zbar.scan(options).then(barcodeData => {
      // let user_id = barcodeData.text;
      let user_id = barcodeData;

      console.log("barcodeData "+ barcodeData);

      console.log("scan friend id: "+user_id);

      this.provider.addfriends(user_id,data => {

        data = JSON.parse(data)
        if(data.success) {
          console.log("friendrequestsent");
          this.helper.presentToast(this.translate.instant("friendrequestsent"));
        }
        else {       
          if(data.errors == "you sent friend request before to this user") {
            console.log("alreadyAdded");            
            this.helper.presentToast(this.translate.instant("alreadyAdded"));
          
          } else if(data.errors == "you are already friend with this user") {
            console.log("alreadyFriend");                        
            this.helper.presentToast(this.translate.instant("alreadyFriend"));                
          
          } else if(data.errors == "This user sent you friend request check your inbox") {
            this.helper.presentToast(this.translate.instant("friendSendToYou"));                
          } 
          console.log(data.errors);
        }
        console.log(JSON.stringify(data));

      },error => {
        console.log(error);
        console.log(this.translate.instant('serverErr'));
      });

    }, (err) => {
        console.log('Error: ', err);
    });
  }


  onInput(text) {
    if(text) {
      this.friends = this.allFriends.filter(element => {      
        if(element.phone === null) element.phone = "";
        return (element.username.toLowerCase().indexOf(text.toLowerCase()) > -1) || (element.phone.indexOf(text) > -1); 
      });
    } else {
      this.friends = this.allFriends;
    }
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
