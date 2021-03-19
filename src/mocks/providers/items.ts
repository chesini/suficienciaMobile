import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Item } from '../../models/item';

@Injectable()
export class Items {
  items: Item[] = [];
  list: any;

  constructor(public angularFireDatabase: AngularFireDatabase) {
    this.list = this.angularFireDatabase.database.ref('requests');
    this.items = [];
    
    this.list.on('value', (snapshot) => {
      console.log("snapshot");
      var result = snapshot.val();
      for(let k in result){
        console.log(result[k].title);
        result[k].key = k;

        let user = this.angularFireDatabase.database.ref('users/' + result[k].UUID);
        user.on('value', (userData) => {
          result[k].name = userData.child('name').val();
          result[k].selfie = userData.child('selfie').val();  
          let aux = new Item(result[k]);
          let existente = this.items.filter((pitem)=>{
            return pitem.key == aux.key;
          });
          if(existente.length <= 0){
            this.add(aux);
          }else {
            for(let j in this.items) {
              if(this.items[j].key == aux.key) this.items[j] = aux;
            }
          }
        });
      }
    });
  }

  query(params?: any) {

    // console.log(JSON.stringify(this.items));
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  add(item: Item) {
    this.items.push(item);
  }

  delete(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
  async clear(){
    this.items = [];
  }
}
