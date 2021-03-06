import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { CreategroupPage } from '../creategroup/creategroup';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { FriendlistPage } from '../friendlist/friendlist';
import { FormControl } from '@angular/forms';
import { debounceTime } from "rxjs/operators";


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
  allGroups:any = [];
  searchControl: FormControl;
  searching: any = false;

  constructor(public alertCtrl:AlertController,
              public storage:Storage,
              public provider:MainproviderProvider,
              public platform:Platform,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public ViewCtrl:ViewController) {

              this.searchControl = new FormControl();

  }

  ionViewWillEnter() {
    this.loadData();

    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.onInput(search);
    });
  }

  loadData() {

      this.storage.get("Makadyuser_name").then((val1)=>{
        if(val1)
        {
        this.username=val1;
        }
      });
      this.langdirection=this.helper.langdirection;
   
      this.provider.friends(data => {
        
        let parsedData = JSON.parse(data);

        parsedData.groups.forEach(group => {
          group.members = group.members.slice(0,4);
          console.log("group length: "+ group.members.length);           
        });
        
        this.groups = parsedData.groups;

        this.allGroups = this.groups;

        console.log("groupsss"+JSON.stringify(this.groups));

    
    
      },error => {
        console.log(error);
      })

  }

  onSearchInput() {
    this.searching = true;
  }
  
onInput(input) {
  if(input) {
    this.groups = this.allGroups.filter(element => {      
      return (element.group_name.toLowerCase().indexOf(input.toLowerCase()) > -1); 
    });
  } else {
    this.groups = this.allGroups;
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
        text: this.translate.instant('yes'),
        handler: () => {
       
       
        this.provider.deletegroups(id,(data)=>{
          console.log(JSON.stringify(data))
          for(var i=0;i<this.groups.length;i++) {
            if (this.groups[i].group_id == id) {
              this.groups.splice(i, 1);
            }
          }
        },error => {
          console.log(error);
        })
        
        }
      },
      {
        text: this.translate.instant('no'),
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
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
    });
  }
}
