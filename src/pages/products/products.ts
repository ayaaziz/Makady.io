import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


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
              public barcodeScanner:BarcodeScanner) {


    this.userMenuId = this.navParams.get("fromUserList");
    this.langdirection=this.helper.langdirection;                    
    this.categoryId = this.navParams.get("id");
    this.categoryName = this.navParams.get("categoryName");

    this.loadData();

  }

  loadData() {
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.getproducts(this.categoryId,"",val,(data) => {
          let parsedData=JSON.parse(data);
          this.products=parsedData.data;
          this.products.forEach(element => {
            element["count"]=this.count;

          });
          console.log(parsedData);
        },(error) => {

        });
      }
    });
  }

  onInput(input) {
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.getproducts(this.categoryId,input,val,(data) => {
          let parsedData=JSON.parse(data);
          this.products=parsedData.data;
          console.log(parsedData);
          this.products.forEach(element => {
            element["count"] = this.count;  
          });
        },(error)=>{

        });
      }
    });
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
          if(element.count > 1)
            element.count -= 1;
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

      this.storage.get("makadyaccess").then((val) => {
      
        if(val) {
          this.provider.addtomenu(this.userMenuId,this.categories,val,(data) => {
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
                        text: this.translate.instant('cancel'),
                        role: 'cancel',
                        handler: () => {
                          console.log('Cancel clicked');
                        }
                      },
                      {
                        text: this.translate.instant('ok'),
                        handler: () => {
                          // this.update(proid);
                          this.update(proid,quantity,this.categories)
                        }
                      }
                    ]
                  });
                  alert.present();
                } 
            } else {
                this.helper.presentToast(this.translate.instant('productadded'));
            }
          },(error)=>{})
        }
      });

    } else {
      this.doRadio();
    }
  }

   doRadio() {  
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(1,"",val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          console.log(JSON.stringify(parsedData.data));
          let alert = this.Alert.create();
          alert.setTitle(this.translate.instant('Selectmenu'));
          parsedData.data.forEach(element => {
            alert.addInput({type: 'radio', label: element.menu_name, value: element.menu_id});    
          });
          alert.addButton(this.translate.instant('cancel'));
          alert.addButton({
            text: this.translate.instant('ok'),
            handler: data => {
              alert.dismiss();
              console.log(typeof(data));
              console.log(JSON.stringify(data));
              this.provider.addtomenu(data,this.categories,val,(data) => {
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
                          text: this.translate.instant('cancel'),
                          role: 'cancel',
                          handler: () => {
                            console.log('Cancel clicked');
                          }
                        },
                        {
                          text: this.translate.instant('ok'),
                          handler: () => {
                            // this.update(proid);
                            this.update(proid,quantity,this.categories)
                          }
                        }
                      ]
                    });
                    alert.present();
                
                  } else {
                      this.helper.presentToast(this.translate.instant('productadded'));
                }
              },(error)=>{})
              return false;
            }
          });
          alert.present()
        },(error)=>{})
      }
    });
  }

  update(id, quantity, categories) {
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.updateproduct(id,parseInt(this.categories[0].quantity) + quantity,val,(data)=>{
          let ParseData=JSON.parse(data)
          if(ParseData.success==true)
          {
          this.helper.presentToast(this.translate.instant('countincreased'));
          }
        },(error)=>{});
      }
    });
  }

  searchByBarcode() {
    this.barcodeScanner.scan().then(barData => {

      let prodCode = barData.text;
      console.log("prodCode: "+prodCode);
      this.storage.get("makadyaccess").then(val => {
        if(val) {
          this.provider.searchProdByBarCode(this.categoryId,prodCode,val,prodData => {
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
        }
    })
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
    }, 2000);
  }
  
}
