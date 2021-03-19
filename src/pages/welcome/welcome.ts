import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Tab1Root } from '../';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public menu: MenuController, public firebaseAuth: AngularFireAuth ) { }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  
  ionViewDidEnter() {
    this.menu.enable(false);
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.navCtrl.push(Tab1Root);
      }
    });
  }
}
