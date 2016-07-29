import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/home/home.html'
})


export class HomePage {
  isAndroid: boolean = false;

  constructor(
    private navController: NavController,
    private platform: Platform
  ) {
    this.isAndroid = this.platform.is('android');
  }
}
