import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class SettingsProvider {

  private isRecentProductNotificationChecked:boolean = false;
  private isOffersNotificationChecked:boolean = false;

  constructor(public http: HttpClient,
              private storage:Storage) {
    console.log('Hello SettingsProvider Provider');
  }

  //change the product notification toggle
  changeProductNotificationToggle(isToggleChecked:boolean) {
      this.isRecentProductNotificationChecked = isToggleChecked; //update status directly when change settings
      this.storage.set('productNotificationStatus',this.isRecentProductNotificationChecked);
  }

  //use in app component
  //get the notification status
  getNotificationStatus() {
    return this.storage.get('productNotificationStatus');  
  }

  sendNotificstionStatus(status:boolean) {
    this.isRecentProductNotificationChecked = status; //update status from storage
  }

  returnNotification() {
    return this.isRecentProductNotificationChecked;
  }

  //************************ Offers ****************************//

  //change the product notification toggle  
  changeOffersNotificationToggle(isToggleChecked:boolean) {
    this.isOffersNotificationChecked = isToggleChecked; //update status directly when change settings
    this.storage.set('offersNotificationStatus',this.isOffersNotificationChecked);
  }

   //use in app component
  //get the notification status
  getOffersNotificationStatus() {
    return this.storage.get('offersNotificationStatus');  
  }

  sendOffersNotificstionStatus(status:boolean) {
    this.isOffersNotificationChecked = status; //update status from storage
  }

  returnOffersNotification() {
    return this.isOffersNotificationChecked;
  }

}
