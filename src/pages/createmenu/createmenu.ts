import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Platform } from 'ionic-angular/platform/platform';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';
import { a } from '@angular/core/src/render3';

@Component({
  selector: 'page-createmenu',
  templateUrl: 'createmenu.html',
})
export class CreatemenuPage {
  langdirection:any
  friends:any=[]
  check:any
  name:any = "";
  id:any=""
  page:any
  menuid:any
  menuname:any;
  friendsInMenu:any = [];
  removedIds:any = "";
  isInvalidNameEmpty:boolean = false;
  isInvalidNameLength:boolean = false;
  menuNameTakenValidation:string = "";
  addedIdArr:any = [];
  removedIdArr:any = [];

  constructor(public ViewCtrl:ViewController,
    public toastCtrl:ToastController,
    public storage:Storage,
    public provider:MainproviderProvider,
    public platform:Platform,
    public helper:HelperProvider,
    public translate:TranslateService,
    public navCtrl: NavController, 
    public navParams: NavParams) {

        this.page=this.navParams.get("page");
        this.menuid = this.navParams.get("menuid");
        // alert(this.menuid);
        this.menuname=this.navParams.get("name");
  }

  loadData() {
    if(this.page === "edit")
    {
      this.name = this.menuname;

    }
    this.langdirection=this.helper.langdirection;
  
      if(this.page === "edit") {
        
        //get friends not in menu
        this.provider.getFriendsNotInMenu(this.menuid,data => {
          data = JSON.parse(data);
          console.log(JSON.stringify(data));
          
          this.friends = data.friend;
         },
         error => {
          console.log(error);
         });

         //get friends in menu
         this.provider.getFriendsInMenu(this.menuid,data => {
           data = JSON.parse(data);
          this.friendsInMenu = data.friend;
          console.log("friendsInMenu......: "+JSON.stringify(this.friendsInMenu));
          
         },error => {
          console.log(error);
         })
         
      } else {
          this.provider.friends(data => { 
          console.log(JSON.stringify(data));
          let parsedData = JSON.parse(data);
          this.friends = parsedData.friends;
        },error=> {
          console.log(error);          
        })
      }
  }
  
  ionViewDidEnter() {
    this.loadData();
  }

  onBlur() {
    this.isInvalidNameEmpty = false;

    if(!this.name) 
      this.isInvalidNameEmpty = true;
  }

  onChange() {
    this.isInvalidNameLength = false;
    this.isInvalidNameEmpty = false;

    if(!this.name) {
      this.isInvalidNameEmpty = true;

    } else if(this.name.length < 4) {
      this.isInvalidNameLength = true;
    } 
  }

  checkfriend(id,ev)
  {
      // this.id=this.id+','+id
      if(ev.value) {
        this.addedIdArr.push(id);
      } else {
        let index = this.addedIdArr.indexOf(id);
        if(index > -1) {
          this.addedIdArr.splice(index,1);
        }
      }
  
      this.id = this.addedIdArr.join(',');;
  }

  unCheckFriend(id,ev) {
    // this.removedIds=this.removedIds+','+id;   
    if(!ev.value) {
      this.removedIdArr.push(id);
    } else {
      let index = this.removedIdArr.indexOf(id);
      if(index > -1) {
        this.removedIdArr.splice(index,1);
      }
    }

    this.removedIds = this.removedIdArr.join(',');  
  }

  create() {
    this.isInvalidNameEmpty = false;
    this.isInvalidNameLength = false;      
    this.menuNameTakenValidation = "";

    if(this.name.length === 0) {
      this.isInvalidNameEmpty = true;
      return;

    } else if(this.name.length < 4) {
        this.isInvalidNameLength = true;      
        return;
    }
  
   if(this.id.charAt(0) == ',' )
   {
     this.id = this.id.substr(1);
     console.log(this.id);
   }

   if(this.page=="edit")
   {
    
      this.provider.editmenu(this.name,this.id,this.removedIds,this.menuid,data => {
      console.log(JSON.stringify(data))
      data = JSON.parse(data);

      if(data.success) {
        this.name="";
        this.check = false;
        this.presentToast(this.translate.instant('edited'));
        this.navCtrl.setRoot(ShoppinglistPage);
      } else {
          if(data.errors.name_en == "The name en has already been taken.") {
            this.menuNameTakenValidation = this.translate.instant("menuNameTaken");
          }
        }  
      },error => {
        console.log(error);
      })
    
    } else {
        this.provider.createmenu(this.name,this.id,data => {
          
          console.log(JSON.stringify(data));
          data = JSON.parse(data);

          if(data.success) {
            this.name="";
            this.check = false;
            this.presentToast(this.translate.instant('created'));
            this.navCtrl.setRoot(ShoppinglistPage);     
          
          } else {
      
            if(data.errors.name_en == "The name en has already been taken.") {
              this.menuNameTakenValidation = this.translate.instant("menuNameTaken");
            }
          }
        },error => {
          console.log(error);
        });
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
