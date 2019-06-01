import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
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
  groups:any = [];
  // show:any=true
  // hide:any=false
  username:any;

  constructor(public alertCtrl:AlertController,
              public storage:Storage,
              public provider:MainproviderProvider,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public ViewCtrl:ViewController) {
  }

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.storage.get("Makadyuser_name").then((val1)=>{
      if(val1)
      {
       this.username=val1;
      }
    });
     this.langdirection=this.helper.langdirection
     this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.friends(val,data => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.groups=parsedData.groups;

          let groups1 = [];
          this.groups.forEach(group => {
            if(group.members > 3) {
              group.members.slice(0,3);
              groups1.push(group);
            console.log("memberssss"+JSON.stringify(group.members));              
            }

            this.groups = groups1;
          });
          console.log("groupsss"+JSON.stringify(this.groups));
      
        },error => {

        })
      }
    });
  }
  
onInput(input)
{
  if(input=="") {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        // this.show = true;
        // this.groups=[];
        this.provider.friends(val,(data)=>{
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.groups=parsedData.groups;
        },(data)=>{
      });
    }
  });
}
else {
  this.storage.get("makadyaccess").then((val)=>{
    if(val)
    {
        this.provider.searchgroups(input,val,(data) => {
          console.log(JSON.stringify(data));
          // this.groups=[]
          // this.show=false
          let parsedData = JSON.parse(data);
            // this.groups = parsedData.data;
            let newGroups = [];
            let images = [];
            
            parsedData.data.forEach(group => {
              
              group.profile_pic.forEach(img => {
                console.log(JSON.stringify(img))
                // img = JSON.stringify(img);
                images.push({"profile_pic":this.helper.userImagePath + img.profile_pic})
              })
              
              let names = { 
                "group_name": group.name_en,
                "members":images.slice(0,3)
              }

              console.log(JSON.stringify(images));
              
              newGroups.push(names);
              
              this.groups = newGroups;
              console.log(JSON.stringify("search group data: "+JSON.stringify(this.groups)));
            });
        },(data) => {
      });
    }
  })
}
}
oncancel()
{
 
this.myInput=""

}
editgroup(id,name) {
  this.navCtrl.push(CreategroupPage,{page:"edit",groupid:id,name:name});
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


  doRefresh(event) {

    console.log("eventtt: "+event);

    console.log('Begin async operation');

    this.loadData();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    }, 2000);
  }
}
