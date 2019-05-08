import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
id:any
name:any
  constructor(public translate:TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    this.id=this.navParams.get("id")
    this.name=this.navParams.get("name")

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

}
