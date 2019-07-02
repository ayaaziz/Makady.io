import { Component } from '@angular/core';
import { OffersPage } from '../offers/offers';
import { HomePage } from '../home/home';
import { GroupsPage } from '../groups/groups';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';
import { Events, Platform, AlertController, NavController, Nav } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { FriendlistPage } from '../friendlist/friendlist';
import { HelperProvider } from '../../providers/helper/helper';
import { FriendsPage } from '../friends/friends';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ShoppinglistPage;
  tab3Root = OffersPage;
  tab4Root = FriendlistPage;
  tab5Root = FriendsPage;

  tabIndex:number = 2;
  reqNo:number = 0;

  constructor(public provider:MainproviderProvider,
              public params: NavParams,
              public event:Events,
              public storage:Storage,
              public helper:HelperProvider,
              private platform:Platform,
              private alertCtrl:AlertController) {

                platform.registerBackButtonAction(() => {
                  console.log("backPressed 1");
            
                  const alert = this.alertCtrl.create({
                    title: 'App termination',
                    message: 'Do you want to close the app?',
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            console.log('Application exit prevented!');
                        }
                    },{
                        text: 'Close App',
                        handler: () => {
                            this.platform.exitApp(); // Close this application
                        }
                    }]
                });
                alert.present();
                },1);


  let tabIndex2 = this.params.get('tabIndex');
    if (parseInt(tabIndex2) > -1) {
      this.tabIndex = tabIndex2;
    }

    this.event.subscribe("removeRequest",() => {
      this.reqNo--;
    });
  }

  ionViewWillEnter() {
    this.getFriendRequestsNo();
  }

  getFriendRequestsNo() {
    this.storage.get("makadyaccess").then(val => {
      if(val) {
        this.provider.friendrequests(val,(data) => {
          if(data) {
            data = JSON.parse(data);
            this.reqNo = data.friends.length;
          }
        },err =>{
          console.log(err);
        });
      }
    });
  }
}
