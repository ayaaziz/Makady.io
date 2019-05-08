import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  langdirection:any
  friends:any=[]
  groups:any=[]
  constructor(public alertCtrl:AlertController,public ViewCtrl:ViewController,public barcodeScanner: BarcodeScanner,public storage :Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.friends(val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.friends=parsedData.friends
      this.groups=parsedData.groups
    },(data)=>{

    })

      }
    })

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
    this.barcodeScanner.scan().then(barcodeData => {
      let user_id = barcodeData.text;
      this.storage.get("makadyaccess").then((val)=>{
        if(val)
        {
      this.provider.addfriends(user_id,val,(data)=>{
     console.log(JSON.stringify(data))
      },(data)=>{

      })
    }
  })
    }, (err) => {
        console.log('Error: ', err);
    });
  }
  
}
