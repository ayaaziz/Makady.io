import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { HelperProvider } from '../../providers/helper/helper';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { ListdetailsPage } from '../listdetails/listdetails';
import { CreatemenuPage } from '../createmenu/createmenu';

@Component({
  selector: 'page-shoppinglist',
  templateUrl: 'shoppinglist.html',
})
export class ShoppinglistPage {
  langdirection:any;
  lists:any="yourlist";
  myInput:any="";
  listes:any=[];
  hide:any=true;
  inlistes:any;
  show:any=true;
  hide1:any=true;
  hide2:any=true;
  userId:number;

  constructor(public alertCtrl:AlertController,
              public platform:Platform,
              public translate:TranslateService,
              public storage:Storage,
              public helper:HelperProvider,
              public provider:MainproviderProvider,
              public navCtrl: NavController,
              public navParams: NavParams,
              public event:Events) {

  }

  ionViewDidLoad() {
    this.hide2=false;
    this.hide1=true;
    this.langdirection = this.helper.langdirection;
   
    
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(1,"",val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData = JSON.parse(data);
          this.listes = parsedData.data;
        
          if(this.listes.length==0) {
            this.hide = false;
            this.show = true;
          
          } else {
            this.hide = true;
          }
        },(data)=>{});
      }
    });
  }

  onInput(input) {
    this.listes=[];
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(1,input,val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.listes=parsedData.data;
          if(this.listes.length==0) {
            this.show=false;
            this.hide=true;
          
          } else {
            this.show=true;
          }
        },(data)=>{});
      }
    });
  }

  editlist(id,name) {
    this.navCtrl.push(CreatemenuPage,{page:"edit",menuid:id,name:name});
  }

  onInputinvited(input) {
    this.listes=[];

    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(2,input,val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.inlistes=parsedData.data;
          if(this.inlistes.length==0) {
            this.show = false;
            this.hide = true;
          }
          else{
            this.show = true;
          }
        },(data)=>{});
      }
    })
  }

  getinvited() {  
    this.listes = [];
    this.hide1 = false;
    this.hide2 = true;
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(2,"",val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.inlistes=parsedData.data;
          if(this.inlistes.length==0) {
            this.show = false;
            this.hide = false;
          
          } else {
            this.show = true;
          }
     
        },(data)=>{});
      }
    });
  }

  getlist() { 
    this.listes = []; 
    this.hide2 = false;
    this.hide1 = true;
    this.show = true;
    this.hide = false;
    this.storage.get("makadyaccess").then((val) => {
      if(val) {
        this.provider.menus(1,"",val,(data) => {
          console.log(JSON.stringify(data));
          let parsedData=JSON.parse(data);
          this.listes=parsedData.data;
        
          if(this.listes.length==0) {
            this.hide=false;
            this.show=false;
          
          } else {
            this.hide=true;
          }
        },(data)=>{});
      }
    });
  }

  deletelist(id,type:string) {
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
            this.storage.get("makadyaccess").then((val) => {
              if(val) {

                //delete Menu, if it is user's Menu
                if(type === "userList") {
                  this.provider.deletemenu(id,val,(data) => {
                    console.log(JSON.stringify(data));
                    for(var i=0;i<this.listes.length;i++) {
                      if (this.listes[i].menu_id == id) {
                        this.listes.splice(i, 1);
                      }
                    }
                    console.log("Menu Deleted");
                    
                  },(error)=>{
                  });
                //remove user from this Menu, if it is invited Menu
                } else if(type === "invitedList") {
                  
                  console.log("type: "+type);
                  this.storage.get("user_info").then(data => {

                    console.log("user data: "+JSON.stringify(data));

                    this.userId = data.user.id;
                    console.log("user id: "+ this.userId);
                    this.provider.removeUserFromMenu(id,this.userId,val,data => {
                      if(data) {
                        console.log("User Removed From Menu");
                        this.getinvited();
                      }
                    },
                    error => {
                      
                    });
                  });

                }
           
              }
            });
          }
        }
      ]
    });
    alert.present();   
  }

  opendetails(id,name) {
    this.navCtrl.push(ListdetailsPage,{id:id,name:name});
  }

  addmenu() {
    this.navCtrl.push(CreatemenuPage);
  }
}
