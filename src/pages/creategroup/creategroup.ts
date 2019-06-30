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
langdirection:any;
friends:any = [];
check:any;
name:any = "";
id:any="";
page:any;
groupid:any;
groupname:any;
friendsInGroup:any = [];
removedIds:any = "";
isInvalidNameEmpty:boolean = false;
isInvalidNameLength:boolean = false;
menuNameTakenValidation:string = "";

  constructor(public ViewCtrl:ViewController,public toastCtrl:ToastController,public storage:Storage,public provider:MainproviderProvider,public platform:Platform,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    this.page = this.navParams.get("page");
    this.groupid = this.navParams.get("groupid");
    this.groupname = this.navParams.get("name");
  }

  loadData() {
    if(this.page=="edit") {
      this.name = this.groupname;
      // this.pageType = "Edit";
    } else {
      // this.pageType = "Create";      
    }
  
    this.langdirection=this.helper.langdirection;
    this.storage.get("makadyaccess").then((val)=> {

    if(val) {

      if(this.page === "edit") {
        
        //get friends not in group        
        this.provider.getFriendsNotInGroup(this.groupid,val,data => {
          data = JSON.parse(data);
          console.log(JSON.stringify(data));
          
          this.friends = data.friend;
          },
          error => {
          console.log(error);
          });


        //get friends in group
        this.provider.getFriendsInGroup(this.groupid,data => {
          data = JSON.parse(data);
          this.friendsInGroup = data.friend;
          console.log("friendsInGroup......: "+JSON.stringify(this.friendsInGroup));
          
        },error => {
          console.log(error);
        })


      } else {

        this.provider.friends(val,(data)=>{
          console.log(JSON.stringify(data))
          let parsedData=JSON.parse(data)
          this.friends=parsedData.friends
        },(data)=>{

        });

        }
      }
    })
  }

  ionViewDidLoad() {
    this.loadData();
  }
  
  checkfriend(id)
  {
      this.id=this.id+','+id;
      // alert(this.id);
  }

  unCheckFriend(id) {
    this.removedIds=this.removedIds+','+id;   
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
    
    } else if(!this.id && this.page !== "edit") {
      this.helper.presentToast(this.translate.instant("mustAddFriends"));
      return;
    } 

    if(this.id.charAt(0) == ',' )
   {
     this.id = this.id.substr(1);
    //  alert(this.id);     
   }
    if(this.page=="edit")
    {
      this.storage.get("makadyaccess").then((val)=>{
        if(val)
        {

          // if(this.name.length < 4){
          //   this.presentToast(this.translate.instant("groupnamelength"))
          // } else {
            this.provider.editgroup(this.name,this.id,this.removedIds,this.groupid,val,data => {
      
              console.log(JSON.stringify(data));
              data = JSON.parse(data);

              if(data.success) {
                this.name="";
                this.check = false;
                this.presentToast(this.translate.instant('edited'));
                this.navCtrl.pop();
              
              } else {
                if(data.errors.name_en == "The name en has already been taken.") {
                  this.menuNameTakenValidation = this.translate.instant("menuNameTaken");
                }
              }

              },error => {
                console.log(error);
              });
          // }
        }
      })
    }
    else {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        // if(this.name.length < 4){
        //   this.presentToast(this.translate.instant("groupnamelength"))
        // } else {

          this.provider.creategroup(this.name,this.id,val,data => {
            
            console.log(JSON.stringify(data));
            data = JSON.parse(data);

            if(data.success) {
              this.name = "";
              this.check = false;
              this.presentToast(this.translate.instant('created'));
              this.navCtrl.pop();
              
            } else {
              if(data.errors.name_en == "The name en has already been taken.") {
                this.menuNameTakenValidation = this.translate.instant("menuNameTaken");
              }
            }
          },error => {
            console.log(error);
          })
        // }
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
