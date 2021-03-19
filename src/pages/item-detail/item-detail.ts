import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Items } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  comments: any;
  data: string;

  constructor(public navCtrl: NavController, navParams: NavParams, items: Items, public angularFireDatabase: AngularFireDatabase, public firebaseAuth: AngularFireAuth) {
    this.item = navParams.get('item');
    this.comments = this.item.comments ? this.item.comments : [];

    for(let k = 0; k < this.comments.length; k++) {
      angularFireDatabase.database.ref('users/' + this.comments[k].UUID + '/name').once('value',(nome)=>{
        this.comments[k].name = nome.val();
      });
    }

    let timestamp = new Date(parseInt(this.item.timeStamp));
    this.data = timestamp.toLocaleDateString('pt-BR') + ' às ' + timestamp.toLocaleTimeString('pt-BR');
  }

  comentar() {
    var comentario = prompt("Digite o texto do comentario");
    console.log("comentario: "+comentario);
    if(comentario.length > 0)
      this.firebaseAuth.authState.subscribe(user => {
        if (user) {
          let i = this.comments ? this.comments.length : 0;
          this.angularFireDatabase.database.ref('requests/' + this.item.key + '/comments/' + i).set({
            comment: comentario,
            UUID: user.uid
          });
        }
      });
  }

}
