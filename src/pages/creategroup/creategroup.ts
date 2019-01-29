import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { GroupsPage } from '../groups/groups';

@Component({
  selector: 'page-creategroup',
  templateUrl: 'creategroup.html',
})
export class CreategroupPage {
langdirection:any
friends:any=[]
check:any
name:any = ""
id:any=""
page:any
groupid:any
groupname:any
  constructor(public ViewCtrl:ViewController,public toastCtrl:ToastController,public storage:Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
 this.page=this.navParams.get("page")
 this.groupid=this.navParams.get("groupid")
this.groupname=this.navParams.get("name")
  }

  ionViewDidLoad() {
if(this.page=="edit")
{
this.name=this.groupname
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
      this.id=this.id+id
  }
  create()
  {
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
          this.provider.editgroup(this.name,this.id,this.groupid,val,(data)=>{
          console.log(JSON.stringify(data))
          this.name=""
          this.check=false
          this.presentToast(this.translate.instant('edited'))
          this.navCtrl.setRoot(GroupsPage)
        },(data)=>{

          })
        }
      })
    }
    else{
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        if(this.name.length < 4){
          this.presentToast(this.translate.instant(""))
        }
        this.provider.creategroup(this.name,this.id,val,(data)=>{
        console.log(JSON.stringify(data))
        this.name=""
        this.check=false
        this.presentToast(this.translate.instant('created'))
        this.navCtrl.setRoot(GroupsPage)

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
