import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { ProductsPage } from '../products/products';

@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
langdirection:any;
products:any = [];
count:any=1;

  constructor(public provider:MainproviderProvider,
              public ViewCtrl:ViewController,
              public storage:Storage,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController) {

  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.products(val,(data) => {
          console.log(JSON.stringify(data));
          let Dataparsed= JSON.parse(data);
          this.products = Dataparsed.data;
        
        },(error)=>{});
      }
    });
  }

  show(id,catName) {
    this.navCtrl.push(ProductsPage,{id:id,"categoryName":catName});
  }
}
