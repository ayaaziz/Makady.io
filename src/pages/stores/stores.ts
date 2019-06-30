import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';

@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html'
})
export class StoresPage {
langdirection:any;
stores:any = [];
allStores:any = [];

  constructor(public provider:MainproviderProvider,
              public ViewCtrl:ViewController,
              public storage:Storage,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public navParam:NavParams) {

  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    this.langdirection=this.helper.langdirection;

    setTimeout(() => {
      this.provider.getStores(data => {
        console.log(JSON.stringify(data));
        data = JSON.parse(data);
        this.stores = data.data;
      
        this.allStores = this.stores;
        },error => {
          console.log(error);
        });
        
      },500);
    }

  // show(id,catName) {

  //   this.navCtrl.push(ProductsPage,{id:id,"categoryName":catName,"fromUserList":this.userMenuId});    
  // }

  onInput(input) { 
    if(input) {
      this.stores = this.allStores.filter(element => {
        return element.name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
    } else {
      this.stores = this.allStores;
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
