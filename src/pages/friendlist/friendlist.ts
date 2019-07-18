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
  requestsSent:any = [];

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
  
      this.provider.friendrequests((data) => {
        console.log(JSON.stringify(data));
        let parsedData=JSON.parse(data);
        this.friends=parsedData.friends;

        if(this.friends.length == 0) {
          this.hide = false;
        
        } else {
          this.friends.forEach(element => {
            let date = moment(new Date().toUTCString())
            element.updated_at = date.from(moment.utc(element.updated_at));
          });
          this.hide = true;
        }
      },error => {
        console.log(error);
      });

        
      this.provider.getRequestsSent(data => {
        console.log(JSON.stringify(data));
        let parsedData=JSON.parse(data);
        this.requestsSent = parsedData.friends;

      },error => {
        console.log(error);
      });

      console.log('ionViewDidLoad FriendlistPage');
  }

  accept(id) {
 
    this.provider.acceptfriendrequests(id,data => {
      console.log(JSON.stringify(data));
      this.helper.presentToast(this.translate.instant('added'));
      for(var i=0;i<this.friends.length;i++) {
        if (this.friends[i].user_id == id) {
          this.friends.splice(i, 1);
        }
      }
      this.event.publish("removeRequest");

    },error => {
      console.log(error);
    });
  }

  cancel(id) {
    this.provider.deletefriends(id,data => {
      console.log(JSON.stringify(data));
      for(var i=0;i<this.friends.length;i++) {
        if (this.friends[i].user_id == id) {
          this.friends.splice(i, 1);
        }
      }
      this.event.publish("removeRequest");
    },error => {
      console.log(error);
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

  cancelRequest(userId) {
    this.provider.cancelReq(userId,data => {
      for(var i=0;i<this.requestsSent.length;i++) {
        if (this.requestsSent[i].id == userId) {
          this.requestsSent.splice(i, 1);
        }
      }
    },error => {
      console.log(error);
    });
  }
}
