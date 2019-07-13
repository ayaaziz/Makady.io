import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  @ViewChild("tabs") footer:ElementRef;  
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
              private alertCtrl:AlertController,
              private keyboard:Keyboard) {

                // this.platform.ready().then(() => {
                //   this.keyboard.onKeyboardShow().subscribe(() => {
                //     // this.footer.nativeElement.hidden = true;    
                //     // this.hideTabs = true;            
                //   });
                //   this.keyboard.onKeyboardHide().subscribe(() => {
                //     // this.footer.nativeElement.hidden = false;                                                                  
                //     // this.hideTabs = false;            
                //   });
                // });

                platform.ready().then(() => {
                  this.keyboard.onKeyboardShow().subscribe(() => {
                      document.body.classList.add('keyboard-is-open');
                  });
      
                  this.keyboard.onKeyboardHide().subscribe(() => {
                      document.body.classList.remove('keyboard-is-open');
                  });
      });
              

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
