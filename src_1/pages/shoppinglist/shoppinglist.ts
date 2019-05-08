import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ListdetailsPage } from '../listdetails/listdetails';
import { CreatemenuPage } from '../createmenu/createmenu';
import { FriendlistPage } from '../friendlist/friendlist';

@Component({
  selector: 'page-shoppinglist',
  templateUrl: 'shoppinglist.html',
})
export class ShoppinglistPage {
  langdirection:any
  lists:any="yourlist"
  myInput:any=""
  listes:any=[]
  hide:any=true
  inlistes:any
  show:any=true
  hide1:any=true
  hide2:any=true
  constructor(public alertCtrl:AlertController,public platform:Platform,public translate:TranslateService,public storage:Storage,public helper:HelperProvider,public provider:MainproviderProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.hide2=false
    this.hide1=true
    this.langdirection=this.helper.langdirection
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.menus(1,"",val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.listes=parsedData.data
     
      if(this.listes.length==0)
      {
        this.hide=false
        this.show=true
      }
      else{
        this.hide=true

      }
    },(data)=>{})
      }
    })

  }
  onInput(input)
  {
    this.listes=[]
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.menus(1,input,val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.listes=parsedData.data
      if(this.listes.length==0)
      {
        this.show=false
        this.hide=true
      }
      else{
        this.show=true
  
      }
    },(data)=>{})
      }
    })
  }
  editlist(id,name)
  {
    this.navCtrl.push(CreatemenuPage,{page:"edit",menuid:id,name:name})
  }
  onInputinvited(input)
  {
    this.listes=[]

    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
    this.provider.menus(2,input,val,(data)=>{
      console.log(JSON.stringify(data))
      let parsedData=JSON.parse(data)
      this.inlistes=parsedData.data
      if(this.inlistes.length==0)
      {
        this.show=false
        this.hide=true
      }
      else{
        this.show=true
  
      }
    },(data)=>{})
      }
    })
  }
getinvited()

{  
  this.listes=[]
  this.hide1=false
  this.hide2=true
  this.storage.get("makadyaccess").then((val)=>{
    if(val)
    {
  this.provider.menus(2,"",val,(data)=>{
    console.log(JSON.stringify(data))
    let parsedData=JSON.parse(data)
    this.inlistes=parsedData.data
  
    if(this.inlistes.length==0)
    {
      this.show=false
      this.hide=true
    }
    else{
      this.show=true

    }
  },(data)=>{})
    }
  })
}
getlist()
{ 
  this.listes=[] 
  this.hide2=false
  this.hide1=true
  this.show=true
  this.hide=false
  this.storage.get("makadyaccess").then((val)=>{
    if(val)
    {
  this.provider.menus(1,"",val,(data)=>{
    console.log(JSON.stringify(data))
    let parsedData=JSON.parse(data)
    this.listes=parsedData.data
  
    if(this.listes.length==0)
    {
      this.hide=false
      this.show=true
    }
    else{
      this.hide=true

    }
  },(data)=>{})
    }
  })
}
friendlist()
{
  this.navCtrl.push(FriendlistPage)
}
deletelist(id)
{
  let alert = this.alertCtrl.create({
    title: this.translate.instant('confirmmenuMsg'),
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
          this.storage.get("makadyaccess").then((val)=>{
            if(val)
            {
        this.provider.deletemenu(id,val,(data)=>{
       console.log(JSON.stringify(data))
       for(var i=0;i<this.listes.length;i++) {
        if (this.listes[i].menu_id == id) {
          this.listes.splice(i, 1);
        }
      }
        },(data)=>{
  
        })
  
          }
        })
        }
      }
    ]
  });
  alert.present();
    
      }
      opendetails(id,name)
      {
          this.navCtrl.push(ListdetailsPage,{id:id,name:name})
      }
      addmenu()
      {
        this.navCtrl.push(CreatemenuPage)
      }
}
