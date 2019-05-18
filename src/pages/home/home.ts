import { Component, ViewChild } from '@angular/core';
import { NavController, Events, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { TranslateService } from '@ngx-translate/core';
import { HelperProvider } from '../../providers/helper/helper';
import { Chart } from 'chart.js';
import { Storage } from '@ionic/storage';
import { MainproviderProvider } from '../../providers/mainprovider/mainprovider';
import { FriendlistPage } from '../friendlist/friendlist';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('polarChart') polarChart;
  langdirection:any
  public chartLoadingEl: any;
  public pieChartEl: any;
  data:any
  chartdata:any=[]
  price:any=0
  names:any=[];
  currentColor0:string;
  currentColor1:string;
  currentColor2:string;
  currentColor3:string;
x:number = 10;

  constructor(public provider:MainproviderProvider,
              public storage:Storage,
              public helper:HelperProvider,
              public translate:TranslateService,
              public navCtrl: NavController,
              public event:Events,
              public loadingCtrl:LoadingController) {
   
    this.langdirection=this.helper.langdirection;
    
  }
  login()
  {
    this.navCtrl.push(SignupPage)
  }

  friendlist()
  {
    this.navCtrl.push(FriendlistPage)
  }

  ionViewDidEnter()
  { 

    const spinner = this.loadingCtrl.create();
    spinner.present();
    
    // this.storage.get("makadyaccess").then(val => {
    //   if(val) {
    //     this.provider.friendrequests(val,(data) => {
    //       if(data) {
    //         data = JSON.parse(data);
    //         this.requestsNo = data.friends.length;
    //       }
    //     },err =>{

    //     });
    //   }
    // });

    // this.event.subscribe("addRequest",() => {
    //   this.requestsNo++;
    // });

    // this.event.subscribe("removeRequest",() => {
    //   this.requestsNo--;
    // });

    this.storage.get("user_info").then((val)=>{
      if(val)
      { 
        //alert( val.user.id)
        // this.helper.user_id = val.user.id
      }})
      this.chartdata = []
      this.data = []
      this.price = 0
      this.names = []
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.home(val,(data)=>{
          
          spinner.dismiss();

          let dataparsed = JSON.parse(data);
          this.data = dataparsed.data;
          console.log(""+JSON.stringify(this.data));
          if(this.data.length > 0) {

            //get total price
            this.data.forEach(element => {
              this.price += parseInt(element.price);
            });

           this.data.forEach(element => {
            // this.price += parseInt(element.price);
            this.chartdata.push(element.quantity);
            this.names.push(element.name);
        
            //add new properties(color,percentage) for each element in array
            if(element.name === "bakery" || 
              element.name === "\u0645\u062e\u0628\u0648\u0632\u0627\u062a" || 
              element.category_id === 1) {
              element.color = "#7FD3B9";
            
            } else if(element.name === "cleaning supplies" ||
                element.name === "\u0645\u0633\u062a\u0644\u0632\u0645\u0627\u062a \u0627\u0644\u062a\u0646\u0638\u064a\u0641" ||
                element.category_id === 2) {
                element.color = "#DB7F7F";
            
            } else if(element.name === "fruits" ||
                element.name === "\u0641\u0648\u0627\u0643\u0647" ||
                element.category_id === 3) {
                element.color = "#D3A1D2";
            
            } else if(element.name === "dairy products" || 
                element.name === "\u0623\u0644\u0628\u0627\u0646" ||
                element.category_id === 4) {
                element.color = "#FF9EB3";
            }

            element.percentage = Math.floor((element.price * 100) / this.price);

            this.pieChartEl	= new Chart(this.polarChart.nativeElement,
              {
                 type: 'polarArea',
                 data: {
                    
                     datasets: [{
                         label                 : '',
                         data                  : this.chartdata,
                         duration              : 10,
                         easing                : 'easeInQuart',
                         backgroundColor       : ['rgba(0, 187,129, .5)',
                                                  'rgba(185, 17, 17,.5)',
                                                  'rgba(165, 96, 164,.5)',
                                                  'rgba(255, 99, 132, .5)'],
                     }],
                  labels:this.names
                 },
                
        
                 options : {
                //   pieceLabel: {
                //     render: this.cer //show values
                //  },
                  responsive: true,
                    maintainAspectRatio: false,
                    legend         : {
                      labels:{ boxWidth    : 12},
                      display     : true,
                      position    :'bottom',
                      fontSize    : 15,
                      padding     : 1,
                      top         : 0,
                    
                   },
                
                 }
              });
        
       
        
              this.chartLoadingEl = this.pieChartEl.generateLegend();
          }
          
        );
      }
      else{
        this.pieChartEl	= new Chart(this.polarChart.nativeElement,
          {
             type: 'polarArea',
             data: {
                
                 datasets: [{
                     label                 : '',
                     data                  : [0],
                     duration              : 10,
                     easing                : 'easeInQuart',
                     backgroundColor       : ['rgba(0, 187,129, .5)',
                                              'rgba(185, 17, 17,.5)',
                                              'rgba(165, 96, 164,.5)',
                                              'rgba(255, 99, 132, .5)'],
               
                 }],
              labels:['']
             },
            
    
             options : {
            //   pieceLabel: {
            //     render: this.cer //show values
            //  },
              responsive: true,
                maintainAspectRatio: false,
                legend         : {
                  labels:{ boxWidth    : 12},
                  display     : true,
                  position    :'bottom',
                  fontSize    : 15,
                  padding     : 1,
                  top         : 0,
                
               },
            
             }
          });
    
    
    
          this.chartLoadingEl = this.pieChartEl.generateLegend();
      }
  
    
      
        },(error)=>{
          spinner.dismiss();
        })
        
      }
    })
    
  }
}
