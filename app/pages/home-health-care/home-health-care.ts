import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheet, Loading, Toast, Alert, LocalStorage, Storage } from 'ionic-angular';

import {HhcEntryPage} from '../hhc-entry/hhc-entry';
import {HhcHistoryPage} from '../hhc-history/hhc-history';

import {Encrypt} from '../../providers/encrypt/encrypt';
import {Configure} from '../../providers/configure/configure';
import {Hhc} from '../../providers/hhc/hhc';

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

  constructor(
    private nav: NavController,
    private configure: Configure,
    private encrypt: Encrypt,
    private hhc: Hhc
  ) {
    this.localStorage = new Storage(LocalStorage);
    this.url = this.configure.getUrl();
  }

  ngOnInit() {

  }

  showAction(hn) {
    let actionSheet = ActionSheet.create({
      title: 'เมนูใช้งาน',
      buttons: [
        {
          text: 'บันทึกเยี่ยมบ้าน',
          handler: () => {
            this.nav.push(HhcEntryPage, { hn: hn })
          }
        }, {
          text: 'ประวัติเยี่ยมบ้าน',
          handler: () => {
            this.nav.push(HhcHistoryPage, { hn: hn });
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
    this.nav.present(actionSheet);
  }

  search(ev) {
    // console.log(ev);
    if (this.query.length == 13) {
      this.doSearch(this.query);
    }
  }

  doSearch(query) {

    let loading = Loading.create({
      content: 'Please wait...'
    });

    this.nav.present(loading);
    
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

}
