import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController, Events } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { PopoverPage } from '../popover/popover';
import { CategoriesPage } from '../categories/categories';


@Component({
  selector: 'page-listdetails',
  templateUrl: 'listdetails.html',
})
export class ListdetailsPage {
langdirection:any;
id:any
name:any
purchase:any
quantity:any
hide:any=true
show:any=false
alldata:any=[]
details:any=[]
buy:any
price:any
category_name:any
detailsdata:any=[]
products:any=[]
members:any=[]
services;
defaultImgUrl:string;

  constructor(public popoverCtrl:PopoverController,
              public storage:Storage,
              public ViewCtrl:ViewController,
              public translate:TranslateService,
              public provider:MainproviderProvider,
              public helper:HelperProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public event:Events) {

      this.name=this.navParams.get("name")
      this.id=this.navParams.get("id");
     
      this.defaultImgUrl = this.helper.productImagePath;
  }
  toggleSection(x){
    this.buy = "";
    this.price = "";
  
   this.services.forEach(element => {
     if(element.category_id != this.services[x].category_id)
     element.open=false
   });
    this.services[x].open = !this.services[x].open
  }

  ionViewDidEnter() {
    this.langdirection=this.helper.langdirection;
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.getMenudetails(this.id,val,data => {
          if(data) {
            console.log(JSON.stringify(data));
            let parsedData=JSON.parse(data);
            this.members=parsedData.members;
            this.services = parsedData.data.menu_items;
            
            this.services.forEach(element => {
              element.open = false;
            });
            console.log("this.services"+this.services)
          
            this.services.forEach(element => {
              let quantity=0;
              let purchase=0;
              element.products.forEach(element1 => {
                quantity += parseInt(element1.total_quantity);
                purchase += element1.total_quantity_purchase;
                element1.price = ''; 
                element1.quant_count = '';
            
                //each product required quantity
                element1.require_quan = parseInt(element1.total_quantity) - element1.total_quantity_purchase;
                // alert("product quantity: "+parseInt(element1.total_quantity) +"- "+"product quantity purchased: "+ element1.total_quantity_purchase)
                console.log(element1.require_quan);
              });
              
                element.name = element.category_name;

                //total quantity and total purchace of service
                element.quantity = quantity;
                element.purchase = purchase;
                element.required_quantity = quantity - purchase;
                
              
            });
          }
        },error =>{})
      }
    })
  }
  save(id,i,j)
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
       // alert(i +" "+j)
        if(!this.services[i].products[j].quant_count){
          this.helper.presentToast(this.translate.instant("mustinsertPurchased"));
          return;
        }
        if(!this.services[i].products[j].price){
          this.helper.presentToast(this.translate.instant("mustinsertprice"));
          return
        }
        let quant_count = this.helper.parseArabic(this.services[i].products[j].quant_count)
        let price = this.helper.parseArabic(this.services[i].products[j].price)
        if(quant_count <= 0){
          this.helper.presentToast(this.translate.instant("mustinsertPurchased"));
          return;
        }
        if(price <= 0){
          this.helper.presentToast(this.translate.instant("mustinsertprice"));
          return
        }
        if(quant_count > this.services[i].products[j].require_quan){
          this.helper.presentToast(this.translate.instant("purchasedmustnotmorerequired"));
          return
        }

    this.provider.addproduct(id,this.helper.user_id,quant_count,price,val,(data) => {
      
     if(data.success){
       this.helper.presentToast(this.translate.instant("purchaseSaved"));
       this.price= ''
       this.buy = ''
       this.ionViewDidEnter();
 
     }
     else{
       console.log(JSON.stringify(data.errors));
     }
    }
    ,(data)=>{
     this.helper.presentToast(this.translate.instant('serverErr'))
    })
  }
})
  }
  openpop(id,name)
  {
    let popover = this.popoverCtrl.create(PopoverPage,{id:id,name:name});
    popover.present();
  }
  addproduct()
  {
    this.navCtrl.setRoot(TabsPage).then(()=>{

      //aya
      this.navCtrl.push(CategoriesPage,{"fromUserList":this.id});
    })
  }

  // opendetails(name)
  // {
  //   this.hide=false
  //   this.show=true
  //   this.details.forEach(element => {
  //     if(element.category_name==name)
  //     {
  //       this.category_name=name
  //     this.products=element.products
  //     }
  //   });
  //   this.detailsdata.forEach(element => {
  //     if(element.name==name)
  //     {
  //       this.quantity=element.quantity
  //       this.purchase=element.purchase

  //     }
  //   });
  //   for(var i=0;i<this.detailsdata.length;i++) {
  //     if (this.detailsdata[i].name==name) {
  //       this.detailsdata.splice(i, 1);
  //     }
  //   }
 
  // }
  // closedetails()
  // {
  //   this.details=[]
  //   this.detailsdata=[]
  //   this.storage.get("makadydata").then((val)=>{
  //     if(val)
  //     {
  //       this.detailsdata=val
  //       console.log(JSON.stringify(this.detailsdata))

  //     }
  //   })
  //   this.hide=true
  //   this.show=false
  // }
}

