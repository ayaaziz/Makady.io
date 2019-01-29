import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { PopoverPage } from '../popover/popover';
import { AboutPage } from '../about/about';


@Component({
  selector: 'page-listdetails',
  templateUrl: 'listdetails.html',
})
export class ListdetailsPage {
langdirection:any
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
services
  constructor(public popoverCtrl:PopoverController,public storage:Storage,public ViewCtrl:ViewController,public translate:TranslateService,public provider:MainproviderProvider,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
  this.name=this.navParams.get("name")
  this.id=this.navParams.get("id")

  }
  toggleSection(x){
    this.buy = ""
    this.price = ""
  //  if(this.services[x].quantity == this.services[x].purchase)
  //  return
   this.services.forEach(element => {
     if(element.category_id != this.services[x].category_id)
     element.open=false
   });
    this.services[x].open = !this.services[x].open
  }
  ionViewDidEnter() {
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.getMenudetails(this.id,val,(data)=>{
          console.log(JSON.stringify(data))
          let parsedData=JSON.parse(data)
          this.members=parsedData.members
         // this.details=parsedData.data.menu_items
          this.services = parsedData.data.menu_items
          this.services.forEach(element => {
            element.open = false
          });
          console.log("this.services"+this.services)
          // this.details.forEach(element => {
          //   let quantity=0
          //   let purchase=0
          //   element.products.forEach(element1 => {
          //     quantity+= parseInt(element1.total_quantity)
          //     purchase+=element1.total_quantity_purchase
          //   });
          //   let object={
          //     "name" : element.category_name,
          //     "quantity": quantity,
          //     "purchase": purchase
          //   }
          //   this.detailsdata.push(object)
            
         // });
          this.services.forEach(element => {
            let quantity=0
            let purchase=0
            element.products.forEach(element1 => {
              quantity+= parseInt(element1.total_quantity)
              purchase+=element1.total_quantity_purchase
              element1.price = '' 
              element1.quant_count = ''
              element1.require_quan = parseInt(element1.total_quantity) - element1.total_quantity_purchase
            });
            
              element.name = element.category_name
              element.quantity = quantity
              element.purchase = purchase
              element.required_quantity = quantity - purchase
              
           //alert(quantity - purchase)
           // this.detailsdata.push(object)
            
          });
          //this.storage.set("makadydata",this.detailsdata)

        },(data)=>{})
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
          this.helper.presentToast("يجب إخال الكمية التي تم شراؤها")
          return;
        }
        if(!this.services[i].products[j].price){
          this.helper.presentToast("يجب إدخال السعر")
          return
        }
        let quant_count = this.helper.parseArabic(this.services[i].products[j].quant_count)
        let price = this.helper.parseArabic(this.services[i].products[j].price)
        if(quant_count <= 0){
          this.helper.presentToast("يجب إخال الكمية التي تم شراؤها")
          return;
        }
        if(price <= 0){
          this.helper.presentToast("يجب إدخال السعر")
          return
        }
        if(quant_count > this.services[i].products[j].require_quan){
          this.helper.presentToast("يجب ألا تكون الكمية التي تم شراؤها أكبر من الكمية المطلوبة")
          return
        }
    this.provider.addproduct(id,this.helper.user_id,quant_count,price,val,(data)=>{
      
     if(data.success){
       this.helper.presentToast("تم حفظ الشراء بنجاح")
       this.price= ''
       this.buy = ''
       this.ionViewDidEnter()
     }
     else{
       this.helper.presentToast(data.errors)
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
      this.navCtrl.push(AboutPage)
    })
  }
  
}