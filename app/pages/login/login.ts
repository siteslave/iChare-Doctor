import { Component } from '@angular/core';
import { NavController, Toast, Loading, Storage, LocalStorage } from 'ionic-angular';

import {TabsPage}  from '../tabs/tabs';
import {Configure} from '../../providers/configure/configure';
import {Encrypt} from '../../providers/encrypt/encrypt';
import {JwtHelper} from 'angular2-jwt';

import {Login} from '../../providers/login/login';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [Encrypt, Configure, Login, JwtHelper]
})
export class LoginPage {

  public username;
  public password;
  public url;
  public localStorage;

  constructor(
    private nav: NavController,
    private config: Configure,
    private encrypt: Encrypt,
    private login: Login,
    private jwtHelper: JwtHelper
  ) {
    this.url = this.config.getUrl();
    this.localStorage = new Storage(LocalStorage);
  }

  doLogin() {

    if (this.username && this.password) {
      let loading = Loading.create({
        content: 'Please wait...'
      });
    
      this.nav.present(loading);
      let params = this.encrypt.encrypt({ username: this.username, password: this.password });
      let url = `${this.url}/api/login/doctor`;
      console.log(params);

      this.login.doLogin(url, params)
        .then(token => {
          let _token = <string>token;
          console.log(_token);
          let decodeToken = this.jwtHelper.decodeToken(_token);
          // console.log(decodeToken);
          // localStorage.setItem('token', this.token);
          // localStorage.setItem('fullname', decodeToken.fullname);
          // localStorage.setItem('exp', decodeToken.exp);
          this.localStorage.set('fullname', decodeToken.fullname);
          this.localStorage.set('token', _token);
          loading.dismiss();
          this.nav.push(TabsPage);

        }, err => {
          let toast = Toast.create({
            message: 'ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง',
            duration: 3000,
            position: 'top'
          });

          this.nav.present(toast);
          loading.dismiss();
        });
    } else {
      let toast = Toast.create({
        message: 'ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง',
        duration: 3000,
        position: 'top'
      });

      this.nav.present(toast);
    }
  }

}
