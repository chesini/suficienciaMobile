import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private account: { email: string, password: string };
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public firebaseAuth: AngularFireAuth) {
      this.account = {
        email: "",
        password: ""
      };

      this.loginErrorString = "Não foi possível entrar na sua conta. Por favor confirme os seus dados e tente novamente.";
  }

  // Attempt to login in through our User service
  doLogin() {
    this.firebaseAuth.auth.signInWithEmailAndPassword(this.account.email , this.account.password)
    .then(() => {
      this.navCtrl.push(MainPage);
    })
    .catch((erro: any) => {
      console.log(erro);

      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
