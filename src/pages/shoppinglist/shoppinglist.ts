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
  inlistes:any = [];
  show:any=true;
  hide1:any=true;
  hide2:any=true;
  userId:number;
  allLists:any = [];
  allInvitedLists:any = [];
  isInvitedEmpty:boolean = false;
  isListEmpty:boolean = false;

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

  ionViewWillEnter() {
    this.loadData();
  }

  loadData() {
    this.hide2=false;
    this.hide1=true;
    this.langdirection = this.helper.langdirection;
   
    setTimeout(() => {
      this.storage.get("makadyaccess").then((val) => {
        if(val) {
          this.provider.menus(1,"",val,(data) => {
            console.log(JSON.stringify(data));
            let parsedData = JSON.parse(data);
            this.listes = parsedData.data;

            this.allLists = this.listes;
          
            if(this.listes.length === 0) {
              this.hide = false;
              this.show = true;
              this.isListEmpty = true;
            
            } else {
              this.hide = true;
            }
          },(data)=>{});
        }
      });
    },500);
  }

  onInput(input) {

    if(input) {
      this.listes = this.allLists.filter(element => {
        return element.menu_name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });

    } else {
      this.listes = this.allLists;
    }

    if(this.listes.length === 0) {
      this.isListEmpty = true;
    } else {
      this.isListEmpty = false;        
    }

    // this.listes=[];
    // this.storage.get("makadyaccess").then((val) => {
    //   if(val) {
    //     this.provider.menus(1,input,val,(data) => {
    //       console.log(JSON.stringify(data));
    //       let parsedData=JSON.parse(data);
    //       this.listes=parsedData.data;
    //       if(this.listes.length==0) {
    //         this.show=false;
    //         this.hide=true;
          
    //       } else {
    //         this.show=true;
    //       }
    //     },(data)=>{});
    //   }
    // });
  }

  editlist(id,name) {
    this.navCtrl.push(CreatemenuPage,{page:"edit",menuid:id,name:name});
  }

  onInputinvited(input) {

    if(input) {
      this.inlistes = this.allInvitedLists.filter(element => {
        return element.menu_name.toLowerCase().indexOf(input.toLowerCase()) > -1;
      });

    } else {
      this.inlistes = this.allInvitedLists;
    }

    if(this.inlistes.length === 0) {
      this.isInvitedEmpty = true;        
    } else {
      this.isInvitedEmpty = false;                
    }
    // this.listes=[];

    // this.storage.get("makadyaccess").then((val) => {
    //   if(val) {
    //     this.provider.menus(2,input,val,(data) => {
    //       console.log(JSON.stringify(data));
    //       let parsedData=JSON.parse(data);
    //       this.inlistes=parsedData.data;
    //       if(this.inlistes.length==0) {
    //         this.show = false;
    //         this.hide = true;
    //       }
    //       else{
    //         this.show = true;
    //       }
    //     },(data)=>{});
    //   }
    // });
  }

  getinvited() {  
    this.listes = [];
    this.hide1 = false;
    this.hide2 = true;

    setTimeout(() => {  
      this.storage.get("makadyaccess").then((val) => {
        if(val) {
          this.provider.menus(2,"",val,(data) => {
            console.log(JSON.stringify(data));
            let parsedData=JSON.parse(data);
            this.inlistes=parsedData.data;

            this.allInvitedLists = this.inlistes;

            if(this.inlistes.length === 0) {
              this.show = false;
              this.hide = false;
              this.isInvitedEmpty = true;
            
            } else {
              this.show = true;
            }
      
          },(data)=>{});
        }
      });

    },500);

  }

  getlist() { 
    this.listes = []; 
    this.hide2 = false;
    this.hide1 = true;
    this.show = true;
    this.hide = false;

    this.loadData();
    // this.storage.get("makadyaccess").then((val) => {
    //   if(val) {
    //     this.provider.menus(1,"",val,(data) => {
    //       console.log(JSON.stringify(data));
    //       let parsedData=JSON.parse(data);
    //       this.listes=parsedData.data;

    //       this.allLists = this.listes;
        
    //       if(this.listes.length==0) {
    //         this.hide=false;
    //         this.show=false;
          
    //       } else {
    //         this.hide=true;
    //       }
    //     },(data)=>{});
    //   }
    // });
  }

  deletelist(id,type:string) {
    let alert = this.alertCtrl.create({
      title: this.translate.instant('confirmmenuMsg'),
      buttons: [
        {
          text: this.translate.instant('yes'),
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

  opendetails(id,name) {
    this.navCtrl.push(ListdetailsPage,{id:id,name:name});
  }

  addmenu() {
    this.navCtrl.push(CreatemenuPage);
  }

  doRefresh(event) {

    console.log("eventtt: "+event);

    console.log('Begin async operation');

    if(this.hide1) { //lists
      this.getlist();      
    } else { //invited lists
      this.getinvited();
    }

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    });
  }
}
