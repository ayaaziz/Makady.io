import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { ProductsPage } from '../products/products';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
langdirection:any;
products:any = [];
count:any=1;
userMenuId:number;
allCategories:any = [];
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

          // let backAction =  platform.registerBackButtonAction(() => {
          //   console.log("second");
          //   this.navCtrl.pop();
          //   backAction();
          // },2)

          this.searchControl = new FormControl();

  }

  ionViewDidLoad() {
    this.loadData();


    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.onInput(search);

    });
  }

  loadData() {

    setTimeout(() => {
      this.userMenuId = this.navParam.get("fromUserList");
      this.langdirection=this.helper.langdirection;
      this.storage.get("makadyaccess").then((val) => {
        if(val) {
          this.provider.products(val,(data) => {
            console.log(JSON.stringify(data));
            let Dataparsed= JSON.parse(data);
            this.products = Dataparsed.data;

            this.allCategories = this.products;
          
          },(error)=>{});
        }
      });
    },500);
  }

  show(id,catName) {
    // this.navCtrl.push(ProductsPage,{id:id,"categoryName":catName});

    this.navCtrl.push(ProductsPage,{id:id,"categoryName":catName,"fromUserList":this.userMenuId});    
  }

  onSearchInput() {
    this.searching = true;
  }

  onInput(input) { 
    if(input) {
      this.products = this.allCategories.filter(element => {
        return element.category_name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
    } else {
      this.products = this.allCategories;
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
