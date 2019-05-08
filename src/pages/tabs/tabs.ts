import { Component } from '@angular/core';
import { OffersPage } from '../offers/offers';
import { HomePage } from '../home/home';
import { GroupsPage } from '../groups/groups';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ShoppinglistPage } from '../shoppinglist/shoppinglist';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ShoppinglistPage;
  tab3Root = OffersPage;
  tab4Root = GroupsPage;
  tabIndex: Number = 0;
  constructor(public params: NavParams) {
  let tabIndex2 = this.params.get('tabIndex');
    if (parseInt(tabIndex2) > -1) {
      this.tabIndex = tabIndex2;
    }
  }
}
