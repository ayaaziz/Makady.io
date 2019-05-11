import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HelperProvider } from '../helper/helper';

@Injectable()
export class SettingsProvider {

  private isRecentProductNotificationChecked:boolean = false;
  private isOffersNotificationChecked:boolean = false;

  constructor(public http: HttpClient,
              private storage:Storage,
              private helper:HelperProvider) {
    console.log('Hello SettingsProvider Provider');
  }

 //************************ Products ****************************//

  //change the product notification toggle
  changeProductNotificationToggle(isToggleChecked:boolean) {
      this.isRecentProductNotificationChecked = isToggleChecked; 
      this.storage.set('productNotificationStatus',this.isRecentProductNotificationChecked);
      this.helper.prodNotification = isToggleChecked;
  }

  //get the notification status
  getNotificationStatus() {
    return this.storage.get('productNotificationStatus');  
  }

  //************************ Offers ****************************//

  //change the offers notification toggle  
  changeOffersNotificationToggle(isToggleChecked:boolean) {
    this.isOffersNotificationChecked = isToggleChecked;
    this.storage.set('offersNotificationStatus',this.isOffersNotificationChecked);
    this.helper.offersNotification = isToggleChecked;
  }

  //get the notification status
  getOffersNotificationStatus() {
    return this.storage.get('offersNotificationStatus');  
  }
}
