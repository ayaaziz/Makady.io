import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { ZBar, ZBarOptions } from '@ionic-native/zbar';


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})

export class ProductsPage {
  langdirection:any;
  categoryId:any;
  products:any = [];
  count:any = 1;
  categories:any = [];
  procount:any;
  categoryName:string;
  productDetails:any;
  userMenuId:number;
  allProducts:any = [];
  searchControl: FormControl;
  searching: any = false;

  constructor(public alertCtrl:AlertController,
              public toastCtrl:ToastController,
              public Alert:AlertController,
              public platform:Platform,
              public storage:Storage,
              public ViewCtrl:ViewController,
              public translate:TranslateService,
              public provider:MainproviderProvider,
              public helper:HelperProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public barcodeScanner:BarcodeScanner,
              private zbar: ZBar) {


    this.userMenuId = this.navParams.get("fromUserList");
    this.langdirection=this.helper.langdirection;                    
    this.categoryId = this.navParams.get("id");
    this.categoryName = this.navParams.get("categoryName");

    this.searchControl = new FormControl();
    
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

    this.provider.getproducts(this.categoryId,"",data => {
      let parsedData=JSON.parse(data);
      this.products=parsedData.data;
      this.products.forEach(element => {
        element["count"]=this.count;

      });

      this.allProducts = this.products;

      console.log(parsedData);
    },error => {
      console.log(error);
    });
  }

  onInput(input) {
    
    if(input) {
      this.products = this.allProducts.filter(element => {
        return element.product_name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
    } else {
      this.products = this.allProducts;
    }
   

    // this.storage.get("makadyaccess").then((val) => {
      // if(val) {
      //   this.provider.getproducts(this.categoryId,input,val,(data) => {
      //     let parsedData=JSON.parse(data);
      //     this.products=parsedData.data;
      //     console.log(parsedData);
      //     this.products.forEach(element => {
      //       element["count"] = this.count;  
      //     });
      //   },(error)=>{

      //   });
      // }
    // });
  }

  AddQuantityNum(id) {
    this.products.forEach(element => {
      if(element.product_id == id) {
        element.count+=1;
      }
    });
  }

  minusQuantityNum(id) {
    if(this.count >0 ) {
      this.products.forEach(element => {
        if(element.product_id == id) {
          if(element.count > 1) {
            element.count -= 1;
          } else {
            this.helper.presentToast(this.translate.instant("minQuntityone"));
          }
        } 
      });
    }
  }

  addtomenu(item) {
    this.categories = [];
    this.procount = item.count;
    let data = {
      "category_id":(item.category_id).toString(),
      "product_id":(item.product_id).toString(),
      "quantity":(item.count).toString()
    }

    this.categories.push(data);

    console.log(JSON.stringify(this.categories));


    if(this.userMenuId) {

      this.provider.addtomenu(this.userMenuId,this.categories,(data) => {
        console.log(JSON.stringify(data));
        let DataParsed=JSON.parse(data);
        console.log("DataParsed: "+JSON.stringify(DataParsed));
        if(DataParsed.menu_item) {
          if(DataParsed.menu_item.length !=0) {
            console.log("enterrrrrr");
            let proid=DataParsed.menu_item[0].id;
            let quantity= parseInt(DataParsed.menu_item[0].quantity);
            
              let alert = this.alertCtrl.create({
                message: this.translate.instant('alreadyexist'),
                buttons: [
                  {
                    text: this.translate.instant('ok'),
                    handler: () => {
                      // this.update(proid);
                      this.update(proid,quantity,this.categories)
                    }
                  },
                  {
                    text: this.translate.instant('cancel'),
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  }
                ]
              });
              alert.present();
            } 
        } else {
            this.helper.presentToast(this.translate.instant('productadded'));
        }
      },(error)=>{
        console.log(error);
      })

    } else {
      this.doRadio();
    }
  }

   doRadio() {  

        this.provider.menus(1,"",data => {
            console.log(JSON.stringify(data));
            let parsedData=JSON.parse(data);


            if(parsedData.data.length > 0) {

            console.log(JSON.stringify(parsedData.data));
            let alert = this.Alert.create();
            alert.setTitle(this.translate.instant('Selectmenu'));
            parsedData.data.forEach(element => {
              alert.addInput({type: 'radio', label: element.menu_name, value: element.menu_id});    
            });

            alert.addButton({
              text: this.translate.instant('ok'),
              handler: data => {
                alert.dismiss();
                console.log(typeof(data));
                console.log(JSON.stringify(data));
                this.provider.addtomenu(data,this.categories,data => {
                  console.log(JSON.stringify(data));
                  let DataParsed=JSON.parse(data);
                  console.log("DataParsed: "+JSON.stringify(DataParsed));

                  if(DataParsed.success==false && DataParsed.menu_item.length !=0) {
                    let proid=DataParsed.menu_item[0].id;
                    let quantity= parseInt(DataParsed.menu_item[0].quantity);
                      let alert = this.alertCtrl.create({
                        message: this.translate.instant('alreadyexist'),
                        buttons: [
                          {
                            text: this.translate.instant('yes'),
                            handler: () => {
                              // this.update(proid);
                              this.update(proid,quantity,this.categories)
                            }
                          },
                          {
                            text: this.translate.instant('no'),
                            role: 'cancel',
                            handler: () => {
                              console.log('Cancel clicked');
                            }
                          }
                        ]
                      });
                      alert.present();
                  
                    } else {
                      this.helper.presentToast(this.translate.instant('productadded'));
                    }
                },(error)=>{
                  console.log(error);
                })
                return false;
              }
            });
            alert.addButton(this.translate.instant('cancel'));
            alert.present();
      

          } else {
            let newAlert = this.alertCtrl.create({
              message: this.translate.instant("addList"),
              buttons: [
                {
                  text: this.translate.instant("ok"),
                  role: 'cancel'
                }
              ]
            });

            newAlert.present();
          }


        },(error)=>{})
  }

  update(id, quantity, categories) {
    this.provider.updateproduct(id,parseInt(this.categories[0].quantity) + quantity,(data)=>{
      let ParseData=JSON.parse(data)
      if(ParseData.success==true)
      {
      this.helper.presentToast(this.translate.instant('countincreased'));
      }
    },(error)=>{
      console.log(error);
    });
  }

  searchByBarcode() {

    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false
    }

    // this.barcodeScanner.scan().then(barData => {
      this.zbar.scan(options).then(barData => {
      // let prodCode = barData.text;
      let prodCode = barData;

      console.log("prodCode: "+prodCode);
      this.provider.searchProdByBarCode(this.categoryId,prodCode,prodData => {
        console.log(JSON.stringify(prodData));
        
        if(prodData.success) {
            this.products = prodData.data;
            this.products.forEach(element => {
              element["count"] = this.count;
            });

        } else {
          console.log(prodData.errors);
        }
      },err => {
        console.log(this.translate.instant('serverErr'))
      });
    }, (err) => {
        console.log('Error: ', err);
    });
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
