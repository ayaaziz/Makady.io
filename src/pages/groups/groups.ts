import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { CreategroupPage } from '../creategroup/creategroup';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { FriendlistPage } from '../friendlist/friendlist';


@Component({
  selector: 'page-groups',
  templateUrl: 'groups.html',
})
export class GroupsPage {
  langdirection:any
  myInput:any
  groups:any=[]
  show:any=true
  hide:any=false
  username:any
  constructor(public alertCtrl:AlertController,public storage:Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.storage.get("Makadyuser_name").then((val1)=>{
      if(val1)
      {
       this.username=val1
      }
    })
     this.langdirection=this.helper.langdirection
     this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.friends(val,(data)=>{
          console.log(JSON.stringify(data))
          let parsedData=JSON.parse(data)
          this.groups=parsedData.groups
          console.log("groupsss"+JSON.stringify(this.groups))
      
        },(data)=>{

        })
      }
    })
  }
onInput(input)
{
  if(input=="")
{
  this.storage.get("makadyaccess").then((val)=>{
    if(val)
    {
      this.show=true
      this.groups=[]
  this.provider.friends(val,(data)=>{
    console.log(JSON.stringify(data))
    let parsedData=JSON.parse(data)
    this.groups=parsedData.groups
  },(data)=>{

  })

    }
  })
}
else{
  this.storage.get("makadyaccess").then((val)=>{
    if(val)
    {
  this.provider.searchgroups(input,val,(data)=>{
    console.log(JSON.stringify(data))
    this.groups=[]
    this.show=false
    let parsedData=JSON.parse(data)
      this.groups=parsedData.data
    
  },(data)=>{

  })
}
  })
}
}
oncancel()
{
 
this.myInput=""

}
editgroup(id,name)
{
  this.navCtrl.push(CreategroupPage,{page:"edit",groupid:id,name:name})
}
addgroup()
{
this.navCtrl.push(CreategroupPage)
}
deletegroup(id)
{
  let alert = this.alertCtrl.create({
    title: this.translate.instant('confirmMsg'),
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
        this.provider.deletegroups(id,val,(data)=>{
          console.log(JSON.stringify(data))
          for(var i=0;i<this.groups.length;i++) {
            if (this.groups[i].group_id == id) {
              this.groups.splice(i, 1);
            }
          }
        },(data)=>{})
            }
          })
        }
      }
    ]
  });
  alert.present();

 
}
friendlist()
  {
    this.navCtrl.push(FriendlistPage)
  }
}
