import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera } from '@ionic-native/camera';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild('fileInput') fileInput;
  
  form: FormGroup;
  validData: boolean = false;
  
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;
  private signupSuccessString: string;
  private invalidDataString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public firebaseAuth: AngularFireAuth,
    public angularFireDatabase: AngularFireDatabase,
    public camera: Camera,
    public formBuilder: FormBuilder) {
      this.form = formBuilder.group({
        profilePic: [''],
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.form.valueChanges.subscribe((v) => {
        this.validData = this.form.valid;
      });
      this.signupErrorString = "Não foi possível criar a sua conta. Por favor confirme os seus dados e tente novamente.";
      this.signupSuccessString = "Conta criada com sucesso!";
      this.invalidDataString = "Os campos são de preenchimento obrigatório!";
  }

  
  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        cameraDirection: this.camera.Direction.BACK,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Não foi possível capturar a imagem! Tente novamente.');
      })
    } else {
      console.log("Camera nao disponivel");
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  public doSignup(): void {
    // let list = this.angularFireDatabase.database.ref('users/alovelace');
    // let a = list.on('value', (snapshot) => {
    //   console.log(JSON.stringify(snapshot));
    // });
    if(!this.validData) {
      let toast = this.toastCtrl.create({
        message: this.invalidDataString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
    }

    this.firebaseAuth.auth.createUserWithEmailAndPassword(this.form.controls['email'].value , this.form.controls['password'].value)
    .then((res) => {
      console.log(JSON.stringify(res));

      // adicionar o registro com a selfie e nome de usuario para o UUID retornado
      this.angularFireDatabase.database.ref('users/' + res.uid).set({
        name: this.account.name,
        selfie: this.form.controls['profilePic'].value
      }).then(() => {
        let toast = this.toastCtrl.create({
          message: this.signupSuccessString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
      
      this.navCtrl.push(MainPage);
    })
    .catch((erro: any) => {
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
      console.log(JSON.stringify(erro));
    });
  }
}
