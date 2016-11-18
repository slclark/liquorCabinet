import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { AddLiquorPage } from '../add_liquor/add_liquor';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = AddLiquorPage;
    this.tab3Root = ContactPage;
  }
}
