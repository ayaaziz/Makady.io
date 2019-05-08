import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { Storage } from '@ionic/storage';
import { FriendlistPage } from '../friendlist/friendlist';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
 langdirection:any
 offers:any=[]
 myInput:any=""
 count:any=1
 categories:any=[]
 procount:any
  constructor(public toastCtrl:ToastController,public Alert:AlertController,public storage:Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController) {

  }
 ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.offers("",val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.offers=parsedData.data
      this.offers.forEach(element => {
       
        element["count"]=this.count
        
            });
    },(data)=>{})
      }
    })

  }
  onInput(input)
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.offers(input,val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.offers=parsedData.data
      this.offers.forEach(element => {
       
        element["count"]=this.count
        
            });
    },(data)=>{})
      }
    })
  }
  onCancel()
  {
    this.myInput=""
  }
  AddQuantityNum(id)
  {
    
    this.offers.forEach(element => {
      if(element.offer_id==id)
      {
      element.count+=1
      }
    });
  }
  minusQuantityNum(id)
  {

    if(this.count>0)
    {
      this.offers.forEach(element => {
        if(element.offer_id==id)
        {
          element.count-=1
        }
            });
    }
  }
  addtomenu(item)
  {
    let data={
      'category_id':(item.category_id).toString(),
      'product_id':(item.product_id).toString(),
      'quantity':(item.count).toString()
    }
    this.categories.push(data)

    console.log(JSON.stringify(this.categories))
    this.doRadio()
  }
   doRadio() {
    
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.menus(1,"",val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      console.log(JSON.stringify(parsedData.data))
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
          console.log(JSON.stringify(data))
           this.provider.addtomenu(data,this.categories,val,(data)=>{
             console.log(JSON.stringify(data))
             let DataParsed=JSON.parse(data)
             if(DataParsed.success==false && DataParsed.menu_item.length !=0)
             {
               let proid=DataParsed.menu_item[0].id
                  let alert= this.Alert.create({
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
                              this.update(proid)
                        }
                      }
                    ]
                  });
                  alert.present();
             }
             else{
              this.presentToast(this.translate.instant('productadded'))

             }
           },(data)=>{})
          return false;
        }
      });
      alert.present()
    },(data)=>{})
      }
    })
   
   


  }
  presentToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    
    });
    toast.present();
  }
  update(id)
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.updateproduct(id,this.procount,val,(data)=>{
      this.presentToast(this.translate.instant('countincreased'))

    },(data)=>{})
      }
    })
  }
  friendlist()
  {
    this.navCtrl.push(FriendlistPage)
  }
}
