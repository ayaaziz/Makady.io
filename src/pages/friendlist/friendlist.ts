import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ViewController, ToastController, Events } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-friendlist',
  templateUrl: 'friendlist.html',
})
export class FriendlistPage {
  langdirection:any;
  friends:any = [];
  hide:any = true;

  constructor(public toastCtrl:ToastController,
              public Alert:AlertController,
              public platform:Platform,
              public storage:Storage,
              public ViewCtrl:ViewController,
              public translate:TranslateService,
              public provider:MainproviderProvider,
              public helper:HelperProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public event:Events) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    // this.langdirection=this.helper.langdirection;
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.friendrequests(val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.friends=parsedData.friends;

        

          if(this.friends.length == 0) {
            this.hide = false;
          
          } else {
            this.friends.forEach(element => {
              let date = moment(new Date().toUTCString())
              element.created_at = date.from(moment.utc(element.created_at));
            });
            this.hide = true;
          }
        },(data)=>{

        });
      }
    });
    console.log('ionViewDidLoad FriendlistPage');
  }

  accept(id) {
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.acceptfriendrequests(id,val,(data) => {
          console.log(JSON.stringify(data));
          this.helper.presentToast(this.translate.instant('added'));
          for(var i=0;i<this.friends.length;i++) {
            if (this.friends[i].user_id == id) {
              this.friends.splice(i, 1);
            }
          }
          this.event.publish("removeRequest");

        },(data)=>{});
      }
    });
  }

  cancel(id) {
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.deletefriends(id,val,(data) => {
          console.log(JSON.stringify(data));
          for(var i=0;i<this.friends.length;i++) {
            if (this.friends[i].user_id == id) {
              this.friends.splice(i, 1);
            }
          }
          this.event.publish("removeRequest");
          // this.helper.requestsNo--;
          // this.event.publish("respondRequest");
        },(data)=>{});
      }
    });
  }


  goHome() {
    this.navCtrl.setRoot(HomePage);
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
