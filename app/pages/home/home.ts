import { Component } from '@angular/core';
import { Alert, NavController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController) {

  }

}
