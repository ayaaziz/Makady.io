import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { FriendlistPage } from '../friendlist/friendlist';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html'
})
export class OffersPage {
 langdirection:any;
 offers:any=[];
 myInput:any="";
 count:any=1;
 categories:any=[];
 procount:any;
 isResult:boolean = false;
 allOffers:any = [];
 searchControl: FormControl;
 searching: any = false;

  constructor(public toastCtrl:ToastController,
              public Alert:AlertController,
              public storage:Storage,
              public provider:MainproviderProvider,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController) {

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
    
    this.langdirection=this.helper.langdirection;
  
    this.provider.offers("",data => {
      console.log(JSON.stringify(data));
      let parsedData=JSON.parse(data);
      this.offers=parsedData.data;
      this.offers.forEach(element => {      
        element["count"] = this.count;
      });

      this.allOffers = this.offers;
    },(error)=>{
      console.log(error);
    });

  }

  onSearchInput() {
    this.searching = true;
  }

  onInput(input) {

    if(input) {
      this.offers = this.allOffers.filter(element => {
        return element.product_name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
    } else {
      this.offers = this.allOffers;
    }

    // this.storage.get("makadyaccess").then((val) => {
    //   if(val) {
    //     this.provider.offers(input,val,(data) => {
    //       console.log(JSON.stringify(data));
    //       let parsedData=JSON.parse(data);
    //       this.offers = parsedData.data;
    //       this.offers.forEach(element => { 
    //         element["count"] = this.count;
    //         this.isResult = true;
    //       });
    //     },(error)=>{})
    //   }
    // });
  }

  onCancel() {
    this.myInput="";
  }

  AddQuantityNum(id) {  
    this.offers.forEach(element => {
      if(element.offer_id==id) {
        element.count+=1;
      }
    });
  }

  minusQuantityNum(id) {
    if(this.count > 0) {
      this.offers.forEach(element => {
        if(element.offer_id==id) {
          if(element.count > 1)
            element.count-=1;
        }
      });
    }
  }

  addtomenu(item) {
    this.categories = [];
    let data = {
      'category_id':(item.category_id).toString(),
      'product_id':(item.product_id).toString(),
      'quantity':(item.count).toString()
    }
    
    this.categories.push(data);

    console.log(JSON.stringify(this.categories))
    this.doRadio();
  }

   doRadio() {
    
        this.provider.menus(1,"",(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          console.log(JSON.stringify(parsedData.data));
          if(parsedData.data.length == 0) {
            this.helper.presentToast(this.translate.instant("firstaddList"));
            return;
          }
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
              console.log(JSON.stringify(data));
              this.provider.addtomenu(data,this.categories,data => {
                console.log(JSON.stringify(data));
                let DataParsed=JSON.parse(data);
                if(DataParsed.success==false && DataParsed.menu_item.length !=0) {
                  let proid=DataParsed.menu_item[0].id;
                  let quantity= parseInt(DataParsed.menu_item[0].quantity);
                  console.log("quantity1 "+quantity);
                  let alert = this.Alert.create({
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
                              this.update(proid,quantity,this.categories)
                        }
                      }
                    ]
                  });
                  alert.present();
                }
                else {
                  this.helper.presentToast(this.translate.instant('productadded'));
                }
              },error => {
                console.log(error);
              })
              return false;
            }
          });
          alert.present()
        },error => {
          console.log(error);
        })
  }
 
  update(id, quantity, categories) {
    this.provider.updateproduct(id, parseInt(this.categories[0].quantity) + quantity,data => {
      data = JSON.parse(data);
      if(data.success) {
        this.helper.presentToast(this.translate.instant('countincreased'));
      }
    },error => {
      console.log(error);
    })
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
