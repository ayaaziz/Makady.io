import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  names:any=[]
  constructor(public provider:MainproviderProvider,public storage:Storage,public helper:HelperProvider,public translate:TranslateService,public navCtrl: NavController) {
   
    this.langdirection=this.helper.langdirection
  }
  login()
  {
    this.navCtrl.push(SignupPage)
  }
  friendlist()
  {
    this.navCtrl.push(FriendlistPage)
  }
  ionViewDidLoad()
  {
    this.storage.get("makadyaccess").then((val)=>{
      if(val)
      {
        this.provider.home(val,(data)=>{

          let dataparsed=JSON.parse(data)
          this.data=dataparsed.data
          console.log(JSON.stringify(this.data))
          this.data.forEach(element => {
            this.price+=parseInt(element.price)
            this.chartdata.push(element.quantity)
            this.names.push(element.name)
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
          });
        },(data)=>{

        })
      }
    })
    
  }
}