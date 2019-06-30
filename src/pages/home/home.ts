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
  data:any = [];
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

  ionViewDidEnter() { 
    this.loadData();
  }

  loadData() {
   
    setTimeout(() => {
      
        this.chartdata = []
        this.data = []
        this.price = 0
        this.names = []
       this.storage.get("makadyaccess").then((val)=>{
        if(val)
        {
          this.provider.home(val,(data)=>{
            
            // spinner.dismiss();

            let dataparsed = JSON.parse(data);
            this.data = dataparsed.data;
            console.log(""+JSON.stringify(this.data));
            if(this.data.length > 0) {

              //get total price
              this.data.forEach(element => {
                this.price += parseInt(element.price);
              });

            this.data.forEach((element,index) => {
              // this.price += parseInt(element.price);
              this.chartdata.push(element.quantity);
              this.names.push(element.name);
          
              //add new properties(color,percentage) for each element in array
            
              if(index === 0) element.color = "#7FD3B9";
              else if(index === 1) element.color = "#DB7F7F";
              else if(index === 2) element.color = "#D3A1D2";
              else if(index === 3) element.color = "#FF9EB3";
              

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
        else {
          this.pieChartEl	= new Chart(this.polarChart.nativeElement,
            {
              type: 'polarArea',
              data: {
                  
                  //  datasets: [{
                  //      label                 : '',
                  //     //  data                  : [0],
                  //      duration              : 10,
                  //      easing                : 'easeInQuart'
                  //  }]
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
            // spinner.dismiss();
          })
          
        }
      })
    },500);
    
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
