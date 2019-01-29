import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, AlertController, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  langdirection:any
  id:any
  products:any=[]
  count:any=1
  categories:any=[]
  procount:any
  constructor(public alertCtrl:AlertController,public toastCtrl:ToastController,public Alert:AlertController,public platform:Platform,public storage:Storage,public ViewCtrl:ViewController,public translate:TranslateService,public provider:MainproviderProvider,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
  this.id=this.navParams.get("id")
  }

  ionViewDidLoad() {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.getproducts(this.id,"",val,(data)=>{
      let parsedData=JSON.parse(data)
      this.products=parsedData.data
      this.products.forEach(element => {
       
        element["count"]=this.count
        
            });
      console.log(parsedData)
    },(data)=>{

    })
      }
    })
    this.langdirection=this.helper.langdirection
    console.log('ionViewDidLoad ProductsPage');
  }
  onInput(input)
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.getproducts(this.id,input,val,(data)=>{
      let parsedData=JSON.parse(data)
      this.products=parsedData.data
      console.log(parsedData)
      this.products.forEach(element => {
       
        element["count"]=this.count
        
            });
    },(data)=>{

    })
      }
    })
  }
  AddQuantityNum(id)
  {
    
    this.products.forEach(element => {
      if(element.product_id==id)
      {
      element.count+=1
      }
    });
  }
  minusQuantityNum(id)
  {

    if(this.count>0)
    {
      this.products.forEach(element => {
        if(element.product_id==id)
        {
          element.count-=1
        }
            });
    }
  }
  addtomenu(item)
  {
    this.categories=[]
    this.procount=item.count
    let data={
      "category_id":(item.category_id).toString(),
      "product_id":(item.product_id).toString(),
      "quantity":(item.count).toString()
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
          console.log(typeof(data))
          console.log(JSON.stringify(data))
           this.provider.addtomenu(data,this.categories,val,(data)=>{
             console.log(JSON.stringify(data))
             let DataParsed=JSON.parse(data)
             if(DataParsed.success==false && DataParsed.menu_item.length !=0)
             {
               let proid=DataParsed.menu_item[0].id
                  let alert= this.alertCtrl.create({
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
      let ParseData=JSON.parse(data)
      if(ParseData.success==true)
      {
      this.presentToast(this.translate.instant('countincreased'))
      }
    },(data)=>{})
      }
    })
  }
}