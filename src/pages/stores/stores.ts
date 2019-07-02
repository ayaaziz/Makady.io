import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'page-stores',
  templateUrl: 'stores.html'
})
export class StoresPage {
langdirection:any;
stores:any = [];
allStores:any = [];
searchControl: FormControl;
searching: any = false;

  constructor(public provider:MainproviderProvider,
              public ViewCtrl:ViewController,
              public storage:Storage,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public navParam:NavParams) {

                this.searchControl = new FormControl();

              let backAction =  platform.registerBackButtonAction(() => {
                console.log("second");
                this.navCtrl.pop();
                backAction();
              },2)

  }

  ionViewDidLoad() {
    this.loadData();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.onInput(search);
    });
  }

  onSearchInput() {
    this.searching = true;
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
