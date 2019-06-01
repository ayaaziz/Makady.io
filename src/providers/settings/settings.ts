import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../helper/helper';
import { MainproviderProvider } from '../mainprovider/mainprovider';

@Injectable()
export class SettingsProvider {

  // private isRecentProductNotificationChecked:boolean = false;
  // private isOffersNotificationChecked:boolean = false;

  constructor(public http: HttpClient,
              private storage:Storage,
              private helper:HelperProvider,
              private provider:MainproviderProvider) {

    console.log('Hello SettingsProvider Provider');
  }

 //************************ Products ****************************//

  //change the product notification toggle
  changeProductNotificationToggle(isToggleChecked:boolean) {
      // this.isRecentProductNotificationChecked = isToggleChecked; 
      this.storage.set('productNotificationStatus',isToggleChecked);
      this.helper.prodNotification = isToggleChecked;

      this.storage.get("makadyaccess").then(access => {
        if(access) {
          this.provider.notificationStatus(access,this.helper.user_id,2,isToggleChecked ? 1:0,data => {
            console.log(data);
          },
          error => {
            console.log(error);
          });
        }
      });
  }

  //get the notification status
  getNotificationStatus() {
    return this.storage.get('productNotificationStatus');  
  }

  //************************ Offers ****************************//

  //change the offers notification toggle  
  changeOffersNotificationToggle(isToggleChecked:boolean) {
    // this.isOffersNotificationChecked = isToggleChecked;
    this.storage.set('offersNotificationStatus',isToggleChecked);
    this.helper.offersNotification = isToggleChecked;

    this.storage.get("makadyaccess").then(access => {
      if(access) {
        this.provider.notificationStatus(access,this.helper.user_id,3,isToggleChecked ? 1:0,data => {
          console.log(data);
        },
        error => {
          console.log(error);
        });
      }
    });
  }

  //get the notification status
  getOffersNotificationStatus() {
    return this.storage.get('offersNotificationStatus');  
  }
}
