import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ToastController, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { WelcomePage } from '..';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  resquestSendSuccessString: string;

  subGeolocation: Subscription;
  
  constructor(public navCtrl: NavController,
      public toastCtrl: ToastController, 
      public viewCtrl: ViewController, 
      public formBuilder: FormBuilder, 
      public camera: Camera, 
      public geoLocation: Geolocation, 
      public angularFireDatabase: AngularFireDatabase,
      public firebaseAuth: AngularFireAuth) {
    this.form = formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      requestPicture: ['', Validators.required],
      geoLocation: ['', Validators.required],
      timeStamp: ['', Validators.required]
    });

    this.subGeolocation = geoLocation.watchPosition()
                              .filter((p) => p.coords !== undefined) //Filter Out Errors
                              .subscribe(position => {
      this.form.patchValue({ 'geoLocation': position.coords.latitude + ', ' + position.coords.longitude });
      this.form.patchValue({ 'timeStamp': position.timestamp.toString() });
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    this.resquestSendSuccessString = "Solicitação registrada com Sucesso!";
  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        cameraDirection: this.camera.Direction.FRONT
      }).then((data) => {
        this.form.patchValue({ 'requestPicture': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Não foi possível capturar a imagem! Tente novamente.');
      })
    } else {
      alert('Câmera não disponível');
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'requestPicture': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['requestPicture'].value + ')'
  }

  getRequestPictureSource() {
    return this.form.controls['requestPicture'].value ;
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.firebaseAuth.authState.subscribe(user => {
      if (!user) {
        let toast = this.toastCtrl.create({
          message: "Usuário não autenticado",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.popTo(WelcomePage);
      } else {
        this.angularFireDatabase.database.ref('requests/' + this.angularFireDatabase.createPushId()).set({
          title: this.form.controls['title'].value,
          description: this.form.controls['description'].value,
          requestPicture: this.form.controls['requestPicture'].value,
          geoLocation: this.form.controls['geoLocation'].value,
          timeStamp: this.form.controls['timeStamp'].value,
          UUID: user.uid
        }).then(() => {
          let toast = this.toastCtrl.create({
            message: this.resquestSendSuccessString,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.pop();
        });  
      }
      this.subGeolocation.unsubscribe();
    });
  }
}
