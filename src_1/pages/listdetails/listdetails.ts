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
  constructor(public popoverCtrl:PopoverController,public storage:Storage,public ViewCtrl:ViewController,public translate:TranslateService,public provider:MainproviderProvider,public helper:HelperProvider,public navCtrl: NavController, public navParams: NavParams) {
  this.name=this.navParams.get("name")
  this.id=this.navParams.get("id")

  }

  ionViewDidLoad() {
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.getMenudetails(this.id,val,(data)=>{
          console.log(JSON.stringify(data))
          let parsedData=JSON.parse(data)
          this.members=parsedData.members
          this.details=parsedData.data.menu_items
          this.details.forEach(element => {
            let quantity=0
            let purchase=0
            element.products.forEach(element1 => {
              quantity+=element1.total_quantity
              purchase+=element1.total_quantity_purchase
            });
            let object={
              "name" : element.category_name,
              "quantity": quantity,
              "purchase": purchase
            }
            this.detailsdata.push(object)
          });
          this.storage.set("makadydata",this.detailsdata)

        },(data)=>{})
      }
    })
  }
  save(id)
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.addproduct(id,13,this.buy,this.price,val,(data)=>{}
    ,(data)=>{
console.log(JSON.stringify(data))
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
  opendetails(name)
  {
    this.hide=false
    this.show=true
    this.details.forEach(element => {
      if(element.category_name==name)
      {
        this.category_name=name
      this.products=element.products
      }
    });
    this.detailsdata.forEach(element => {
      if(element.name==name)
      {
        this.quantity=element.quantity
        this.purchase=element.purchase

      }
    });
    for(var i=0;i<this.detailsdata.length;i++) {
      if (this.detailsdata[i].name==name) {
        this.detailsdata.splice(i, 1);
      }
    }
 
  }
  closedetails()
  {
    this.details=[]
    this.detailsdata=[]
    this.storage.get("makadydata").then((val)=>{
      if(val)
      {
        this.detailsdata=val
        console.log(JSON.stringify(this.detailsdata))

      }
    })
    this.hide=true
    this.show=false
  }
}
