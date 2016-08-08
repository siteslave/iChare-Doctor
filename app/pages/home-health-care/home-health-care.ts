import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, ToastController, AlertController, LocalStorage, Storage } from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';

import * as _ from 'lodash';

import {HhcEntryPage} from '../hhc-entry/hhc-entry';
import {HhcHistoryPage} from '../hhc-history/hhc-history';

import {Encrypt} from '../../providers/encrypt/encrypt';
import {Configure} from '../../providers/configure/configure';
import {Hhc} from '../../providers/hhc/hhc';
import {OutPatientPage} from '../out-patient/out-patient';

interface CommunityServiceData {
  id: any,
  name: any,
  code: any
}

/*
  Generated class for the HomeHealthCarePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home-health-care/home-health-care.html',
  providers: [Hhc, Encrypt, Configure]
})
  
export class HomeHealthCarePage implements OnInit {
  
  url;
  query;
  patients;
  localStorage;
  hasPatient: boolean = false;
  isAndroid: boolean = false;

  constructor(
    private nav: NavController,
    private configure: Configure,
    private encrypt: Encrypt,
    private hhc: Hhc,
    private platform: Platform,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.localStorage = new Storage(LocalStorage);
    this.url = this.configure.getUrl();
    this.isAndroid = this.platform.is('android');
  }

  ngOnInit() {

  }

  showAction(hashKey) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'เมนูใช้งาน',
      buttons: [
        {
          text: 'บันทึกเยี่ยมบ้าน',
          handler: () => {
            this.nav.push(HhcEntryPage, { hashKey: hashKey })
          }
        }, {
          text: 'ประวัติเยี่ยมบ้าน',
          handler: () => {
            this.nav.push(HhcHistoryPage, { hashKey: hashKey });
          }
        },
        {
          text: 'ประวัติรับบริการ (EMR)',
          handler: () => {
            this.nav.push(OutPatientPage, { hashKey: hashKey });
          }
        }
        , {
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

  search(ev) {
    // console.log(ev);
    if (this.query.length == 13) {
      this.doSearch(this.query);
    }
  }

  doSearch(query) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    
    if (query) {
      let url = `${this.url}/api/doctor/hhc/search`;
      
      let params = { hashKey: query };
    let _params = this.encrypt.encrypt(params);
    this.localStorage.get('token')
      .then(token => {
        this.hhc.search(url, token, _params)
          .then(rows => {
            this.patients = rows;
            loading.dismiss();
          }, err => {
            loading.dismiss();
            console.log(err);
          });
      });
    }
  }

  scanBarcode() {
    BarcodeScanner.scan().then((barcodeData) => {
      // Success! Barcode data is here
      // alert(JSON.stringify(barcodeData));
      this.query = barcodeData.text;
      this.doSearch(this.query);
    }, (err) => {
      // An error occurred
      console.log(err);
    });
  }  
}
