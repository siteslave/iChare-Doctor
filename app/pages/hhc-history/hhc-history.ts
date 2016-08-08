import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, Platform, ActionSheetController, Storage, LocalStorage } from 'ionic-angular';
import {HhcHistoryDetailPage} from '../hhc-history-detail/hhc-history-detail';
import * as moment from 'moment';

import {Hhc} from '../../providers/hhc/hhc';
import {Configure} from '../../providers/configure/configure';
import {Encrypt} from '../../providers/encrypt/encrypt';
/*
  Generated class for the HhcHistoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/hhc-history/hhc-history.html',
  providers: [Hhc, Configure, Encrypt]
})
  
export class HhcHistoryPage implements OnInit {
  isAndroid: boolean = false;
  hashKey;
  localStorage;
  url;
  histories;

  constructor(
    private nav: NavController,
    private platform: Platform,
    private hhc: Hhc,
    private configure: Configure,
    private encrypt: Encrypt,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController
  
  ) {
    this.localStorage = new Storage(LocalStorage);
    this.isAndroid = platform.is('android');
    this.hashKey = this.navParams.get('hashKey');
    this.url = this.configure.getUrl();
  }

  ionViewDidEnter() {
    this.getHistory();
  }

  ngOnInit() {
    // this.getHistory();
  }  

  getHistory() {
    let url = `${this.url}/api/doctor/hhc/history`;
    let params = { hashKey: this.hashKey };
    let _params = this.encrypt.encrypt(params);
    this.localStorage.get('token')
      .then(token => {

        let loading = this.loadingCtrl.create({
          content: 'Please wait...'
        });

        loading.present();

        this.hhc.getHhcHistory(url, token, _params)
          .then(rows => {
            let data = <Array<any>>rows;
            let histories = [];

            for (let v of data) {
              console.log(v);
              histories.push({
                dateServ: moment(v.date_serv).format('DD/MM/YYYY'),
                timeServ: moment(v.time_serv, 'HH:mm:ss').format('HH:mm'),
                id: v.id
              });
            }

            this.histories = histories;
            loading.dismiss();
          }, err => {
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: 'เกิดข้อผิดพลาด ' + JSON.stringify(err),
              duration: 3000,
              position: 'top'
            });

            toast.present();
            console.log(err);
          });
      });

  }

  showAction(id) {
    console.log(id);
    let actionSheet = this.actionSheetCtrl.create({
      title: 'เมนูใช้งาน',
      buttons: [
        {
          text: 'ดูข้อมูล/แก้ไข',
          handler: () => {
            // get history
            this.nav.push(HhcHistoryDetailPage, { id: id });
          }
        }, {
          text: 'ยกเลิก',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();

  }
  
}
