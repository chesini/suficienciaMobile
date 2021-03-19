import { Component } from '@angular/core';
import { IonicPage, MenuController, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers';
import { NewRequestPage } from '../';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController, menu: MenuController) {
    this.items.clear();
    this.currentItems = this.items.query().reverse();
    menu.enable(false);
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    this.items.clear();
    this.currentItems = this.items.query().reverse();
  }

  /**
   * Prompt the user to add a new item. This shows our NewRequestPage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    this.items.clear();
    this.navCtrl.push(NewRequestPage).then(()=> {
      this.currentItems = this.items.query().reverse();
    });
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item
    });
  }
}
