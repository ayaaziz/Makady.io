import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';

@Component({
  selector: 'page-createmenu',
  templateUrl: 'createmenu.html',
})
export class CreatemenuPage {
  langdirection:any
  friends:any=[]
  check:any
  name:any
  id:any=""
  page:any
  menuid:any
  menuname:any;

  constructor(public ViewCtrl:ViewController,public toastCtrl:ToastController,public storage:Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {

        this.page=this.navParams.get("page")
        this.menuid=this.navParams.get("menuid")
        this.menuname=this.navParams.get("name")
  }
  
  ionViewDidEnter() {

    if(this.page === "edit")
    {
      this.name = this.menuname;

    }
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
     if(val)
     {
   this.provider.friends(val,(data)=>{
     console.log(JSON.stringify(data))
     let parsedData=JSON.parse(data)
     this.friends=parsedData.friends
   },(data)=>{

   })

     }
   })
  }
  checkfriend(id)
  {
      this.id=this.id+','+id
  }
  create()
  {
    if(this.name.length < 4){
      this.presentToast(this.translate.instant("groupNameErr"))
      return
    }
   if(this.id.charAt(0) == ',' )
   {
     this.id = this.id.substr(1);
     console.log(this.id)
   }
    if(this.page=="edit")
    {
      this.storage.get("makadyaccess").then((val)=>{
        if(val)
        {
          this.provider.editmenu(this.name,this.id,this.menuid,val,(data)=>{
          console.log(JSON.stringify(data))
          this.name=""
          this.check=false
          this.presentToast(this.translate.instant('edited'))
          this.navCtrl.setRoot(ShoppinglistPage)

          },(data)=>{

          })
        }
      })
    }
    else{
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.createmenu(this.name,this.id,val,(data)=>{
        console.log(JSON.stringify(data))
        this.name=""
        this.check=false
        this.presentToast(this.translate.instant('created'))
        this.navCtrl.setRoot(ShoppinglistPage)

        },(data)=>{})
      }
    })
  }
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
}
